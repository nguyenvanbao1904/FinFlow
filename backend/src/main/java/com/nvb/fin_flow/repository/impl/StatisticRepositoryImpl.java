package com.nvb.fin_flow.repository.impl;

import com.nvb.fin_flow.dto.response.CategoryDistribution;
import com.nvb.fin_flow.dto.response.TimeSeriesDataResponse;
import com.nvb.fin_flow.dto.response.TotalSummaryResponse;
import com.nvb.fin_flow.entity.QCategory;
import com.nvb.fin_flow.entity.QTransaction;
import com.nvb.fin_flow.entity.QUser;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.repository.StatisticRepository;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StatisticRepositoryImpl implements StatisticRepository {

    JPAQueryFactory queryFactory;
    QTransaction t = QTransaction.transaction;
    QCategory c = QCategory.category;
    QUser u = QUser.user;

    @Override
    public TotalSummaryResponse getTotalSummary(String username, LocalDate startDate, LocalDate endDate) {
        return queryFactory
                .select(Projections.constructor(TotalSummaryResponse.class,
                        Expressions.cases()
                                .when(c.type.eq(CategoryType.INCOME)).then(t.amount).otherwise(BigDecimal.ZERO).sum().as("income"),
                        Expressions.cases()
                                .when(c.type.eq(CategoryType.EXPENSE)).then(t.amount).otherwise(BigDecimal.ZERO).sum().as("expense"),
                        Expressions.cases()
                                .when(c.type.eq(CategoryType.SAVING)).then(t.amount).otherwise(BigDecimal.ZERO).sum().as("saving"),
                        Expressions.cases()
                                .when(c.type.eq(CategoryType.INCOME)).then(t.amount).otherwise(BigDecimal.ZERO).sum()
                                .subtract(Expressions.cases()
                                        .when(c.type.eq(CategoryType.EXPENSE)).then(t.amount).otherwise(BigDecimal.ZERO).sum())
                                .subtract(Expressions.cases()
                                        .when(c.type.eq(CategoryType.SAVING)).then(t.amount).otherwise(BigDecimal.ZERO).sum())
                                .as("balance")
                ))
                .from(t)
                .join(t.category, c)
                .join(t.user, u)
                .where(u.username.eq(username).and(t.date.between(startDate, endDate)))
                .fetchOne();
    }

    @Override
    public List<TimeSeriesDataResponse> getTimeSeriesData(String username, String period, LocalDate startDate, LocalDate endDate) {
        StringExpression periodExpression;
        if ("year".equalsIgnoreCase(period)) {
            periodExpression = Expressions.stringTemplate("FUNCTION('DATE_FORMAT', {0}, {1})", t.date, "%Y-%m");
        } else {
            periodExpression = t.date.stringValue();
        }

        return queryFactory
                .select(Projections.constructor(TimeSeriesDataResponse.class,
                        periodExpression,
                        Expressions.cases().when(c.type.eq(CategoryType.INCOME))
                                .then(t.amount).otherwise(BigDecimal.ZERO).sum().coalesce(BigDecimal.ZERO),
                        Expressions.cases().when(c.type.eq(CategoryType.EXPENSE))
                                .then(t.amount).otherwise(BigDecimal.ZERO).sum().coalesce(BigDecimal.ZERO),
                        Expressions.cases().when(c.type.eq(CategoryType.SAVING))
                                .then(t.amount).otherwise(BigDecimal.ZERO).sum().coalesce(BigDecimal.ZERO)
                ))
                .from(t)
                .join(t.category, c)
                .join(t.user, u)
                .where(u.username.eq(username).and(t.date.between(startDate, endDate)))
                .groupBy(periodExpression)
                .orderBy(periodExpression.asc())
                .fetch();
    }

    @Override
    public List<CategoryDistribution> getCategoryDistribution(String username, LocalDate startDate, LocalDate endDate, CategoryType categoryType) {
        BigDecimal totalAmount = queryFactory
                .select(t.amount.sum())
                .from(t)
                .join(t.category, c)
                .join(t.user, u)
                .where(c.type.eq(categoryType)
                        .and(t.date.between(startDate, endDate))
                        .and(u.username.eq(username)))
                .fetchOne();

        if (totalAmount == null || totalAmount.intValue() == 0) {
            return new ArrayList<>();
        }

        return queryFactory.select(Projections.constructor(CategoryDistribution.class,
                        c.name.as("categoryName"),
                        t.amount.sum().as("amount"),
                        t.amount.sum().divide(totalAmount).multiply(100).as("percentage")
                ))
                .from(t)
                .join(t.category, c)
                .join(t.user, u)
                .where(u.username.eq(username).and(t.date.between(startDate, endDate)).and(c.type.eq(categoryType)))
                .groupBy(c.name)
                .fetch();
    }
}