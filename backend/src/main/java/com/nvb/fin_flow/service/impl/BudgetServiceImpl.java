package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.request.BudgetCreationRequest;
import com.nvb.fin_flow.dto.response.BudgetPageableResponse;
import com.nvb.fin_flow.dto.response.BudgetResponse;
import com.nvb.fin_flow.entity.*;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.BudgetMapper;
import com.nvb.fin_flow.repository.BudgetRepository;
import com.nvb.fin_flow.service.BudgetService;
import com.nvb.fin_flow.service.UserService;
import com.nvb.fin_flow.utilities.DateUtility;
import com.nvb.fin_flow.utilities.PageableUtility;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class BudgetServiceImpl implements BudgetService {
    BudgetMapper budgetMapper;
    UserService userService;
    BudgetRepository budgetRepository;
    DateUtility dateUtility;
    PageableUtility pageableUtility;

    @Override
    public BudgetResponse addOrUpdateBudget(BudgetCreationRequest request) {
        Budget newBudget = budgetMapper.toEntity(request);
        User currentUser = userService.getCurrentUser();
        newBudget.setUser(currentUser);

        if (newBudget.getIsRecurring() && newBudget.getRecurringType() != null) {
            newBudget.setNextRecurrenceDate(DateUtility.calculateNextRecurrenceDate(newBudget.getStartDate(), newBudget.getRecurringType()));
        } else {
            newBudget.setNextRecurrenceDate(null);
        }

        Budget existingBudget = budgetRepository
                .findByUserAndCategoryAndStartDateAndEndDate(
                        currentUser, newBudget.getCategory(), newBudget.getStartDate(), newBudget.getEndDate()
                )
                .orElse(null);

        if (existingBudget != null && !request.getIsUpdate()) {
            existingBudget.setAmountLimit(existingBudget.getAmountLimit().add(newBudget.getAmountLimit()));
            newBudget = existingBudget;
        } else if (request.getIsUpdate()) {
            if (existingBudget != null && !existingBudget.getId().equals(newBudget.getId())) {
                throw new AppException(ErrorCode.ENTITY_EXISTED, Map.of("entity", "Budget"));
            }
        }
        try {
            budgetRepository.save(newBudget);
        } catch (DataIntegrityViolationException e) {
            String message = e.getCause().getMessage().split("\\[")[0].trim();
            throw new AppException(ErrorCode.SQL_EXCEPTION, Map.of("ms", message));
        }

        return budgetMapper.toResponse(newBudget);
    }

    @Override
    public BudgetPageableResponse getBudgets(Map<String, String> params) {
        String username = params.get("username");
        String from = params.get("from");
        String to = params.get("to");

        Pageable page = pageableUtility.getPageable(params.get("page"), null);

        if (username == null || from == null || to == null) {
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }

        LocalDate startDate = dateUtility.convertDate(from);
        LocalDate endDate = dateUtility.convertDate(to);

        long total = budgetRepository.countBudgetsByUserInPeriod(username, startDate, endDate);

        List<BudgetResponse> content = budgetRepository.findBudgetsWithTransactionSums(username, startDate, endDate, page);

        return BudgetPageableResponse.builder()
                .budgetResponses(new LinkedHashSet<>(content))
                .totalPages((int) Math.ceil((double) total / page.getPageSize()))
                .build();
    }

    @Override
    public void deleteBudget(String id) {
        try {
            Budget budget = budgetRepository.findById(id).orElse(null);
            if (budget == null) {
                throw new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "Budget"));
            }
            if (!budget.getUser().getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
                throw new AppException(ErrorCode.DO_NOT_HAVE_PERMISSION);
            }
            budgetRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.SQL_EXCEPTION, Map.of("ms", e.getCause().getMessage().split("\\[")[0].trim()));
        }
    }
}