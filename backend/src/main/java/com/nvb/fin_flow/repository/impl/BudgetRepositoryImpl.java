package com.nvb.fin_flow.repository.impl;

import com.nvb.fin_flow.dto.response.BudgetResponse;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.dto.response.IconResponse;
import com.nvb.fin_flow.entity.*;
import com.nvb.fin_flow.repository.BudgetRepository;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BudgetRepositoryImpl extends SimpleJpaRepository<Budget, String> implements BudgetRepository {

    JPAQueryFactory queryFactory;

    public BudgetRepositoryImpl(EntityManager entityManager, JPAQueryFactory queryFactory) {
        super(Budget.class, entityManager);
        this.queryFactory = queryFactory;
    }

    @Override
    public Optional<Budget> findByUserAndCategoryAndStartDateAndEndDate(
            User user, Category category, LocalDate startDate, LocalDate endDate) {
        QBudget budget = QBudget.budget;

        return Optional.ofNullable(
                queryFactory
                        .selectFrom(budget)
                        .where(budget.user.eq(user)
                                .and(budget.category.eq(category))
                                .and(budget.startDate.eq(startDate))
                                .and(budget.endDate.eq(endDate)))
                        .fetchOne()
        );
    }

    @Override
    public List<Budget> findByIsRecurringTrueAndNextRecurrenceDateLessThanEqual(LocalDate date) {
        QBudget budget = QBudget.budget;

        return queryFactory
                .selectFrom(budget)
                .where(budget.isRecurring.isTrue()
                        .and(budget.nextRecurrenceDate.loe(date)))
                .fetch();
    }

    @Override
    public long countBudgetsByUserInPeriod(String username, LocalDate startDate, LocalDate endDate) {
        QBudget budget = QBudget.budget;

        return Optional.ofNullable(
                queryFactory
                        .select(budget.countDistinct())
                        .from(budget)
                        .where(budget.startDate.loe(endDate)
                                .and(budget.endDate.goe(startDate))
                                .and(budget.user.username.eq(username)))
                        .fetchOne()
        ).orElse(0L);
    }

    @Override
    public List<BudgetResponse> findBudgetsWithTransactionSums(String username, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        QBudget budget = QBudget.budget;
        QTransaction transaction = QTransaction.transaction;
        QCategory category = QCategory.category;
        QIcon icon = QIcon.icon;

        return queryFactory.select(Projections.constructor(BudgetResponse.class,
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
                                        icon.id,
                                        icon.name,
                                        icon.iconClass
                                )
                        ),
                        budget.isRecurring,
                        transaction.amount.sum().coalesce(BigDecimal.ZERO)
                ))
                .from(budget)
                .leftJoin(budget.category, category)
                .leftJoin(category.icon, icon)
                .leftJoin(transaction).on(transaction.category.eq(category)
                        .and(transaction.user.eq(budget.user))
                        .and(transaction.date.goe(budget.startDate))
                        .and(transaction.date.loe(budget.endDate)))
                .where(budget.user.username.eq(username)
                        .and(budget.startDate.loe(endDate))
                        .and(budget.endDate.goe(startDate)))
                .groupBy(budget.id, category.id, icon.id)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }
}