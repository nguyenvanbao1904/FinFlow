package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.request.BudgetCreationRequest;
import com.nvb.fin_flow.dto.response.BudgetPageableResponse;
import com.nvb.fin_flow.dto.response.BudgetResponse;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.dto.response.IconResponse;
import com.nvb.fin_flow.entity.*;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.BudgetMapper;
import com.nvb.fin_flow.repository.BudgetRepository;
import com.nvb.fin_flow.service.BudgetService;
import com.nvb.fin_flow.service.UserService;
import com.nvb.fin_flow.utilities.DateUtility;
import com.nvb.fin_flow.utilities.PageableUtility;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class BudgetServiceImpl implements BudgetService {
    BudgetMapper budgetMapper;
    UserService userService;
    BudgetRepository  budgetRepository;
    DateUtility dateUtility;
    JPAQueryFactory queryFactory;
    PageableUtility pageableUtility;

    @Override
    public BudgetResponse addOrUpdateBudget(BudgetCreationRequest budgetCreationRequest) {
        Budget budget = budgetMapper.toEntity(budgetCreationRequest);
        User user = userService.getCurrentUser();
        budget.setUser(user);
        try{
            budgetRepository.save(budget);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.SQL_EXCEPTION, Map.of("ms", e.getCause().getMessage().split("\\[")[0].trim()));
        }

        return budgetMapper.toResponse(budget);
    }

    @Override
    public BudgetPageableResponse getBudgets(Map<String, String> params) {
        QBudget budget = QBudget.budget;
        QTransaction transaction = QTransaction.transaction;
        QCategory category = QCategory.category;

        String username = params.get("username");
        String from = params.get("from");
        String to = params.get("to");

        Pageable page =  pageableUtility.getPageable(params.get("page") , null);

        if (username == null || from == null || to == null) {
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }

        LocalDate startDate = dateUtility.convertDate(from);
        LocalDate endDate = dateUtility.convertDate(to);

        long total = Optional.ofNullable(
                queryFactory
                        .select(budget.countDistinct())
                        .from(budget)
                        .where(budget.startDate.loe(endDate)
                                .and(budget.endDate.goe(startDate))
                                .and(budget.user.username.eq(username)))
                        .fetchOne()
                ).orElse(0L);

        List<BudgetResponse> content = queryFactory.select(Projections.constructor(BudgetResponse.class,
                        budget.id,
                        budget.amountLimit,
                        budget.startDate,
                        budget.endDate,
                        Projections.constructor(CategoryResponse.class,
                                category.id,
                                category.name,
                                category.colorCode,
                                category.type,
                                category.user.username,
                                Projections.constructor(IconResponse.class,
                                        category.icon.id,
                                        category.icon.name,
                                        category.icon.iconClass
                                )
                        ),
                        budget.isRecurring,
                        transaction.amount.sum().coalesce(BigDecimal.ZERO)
                ))
                .from(budget)
                .leftJoin(budget.category, category)
                .leftJoin(transaction).on(transaction.category.eq(category)
                        .and(transaction.date.between(budget.startDate, budget.endDate)))
                .where(budget.startDate.loe(endDate)
                        .and(budget.endDate.goe(startDate))
                        .and(budget.user.username.eq(username)))
                .groupBy(budget.id, category.id)
                .offset(page.getOffset())
                .limit(page.getPageSize())
                .fetch();
        return BudgetPageableResponse.builder()
                .budgetResponses(new LinkedHashSet<>(content))
                .totalPages((int) Math.ceil((double) total / page.getPageSize()))
                .build();
    }

    @Override
    public void deleteBudget(String id) {
        try{
            Budget budget = budgetRepository.findById(id).orElse(null);
            if(budget == null){
                throw new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "Budget"));
            }
            if(!budget.getUser().getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
                throw new AppException(ErrorCode.DO_NOT_HAVE_PERMISSION);
            }
            budgetRepository.deleteById(id);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.SQL_EXCEPTION, Map.of("ms", e.getCause().getMessage().split("\\[")[0].trim()));
        }
    }
}
