package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.response.CategoryDistribution;
import com.nvb.fin_flow.dto.response.TimeSeriesDataResponse;
import com.nvb.fin_flow.dto.response.TotalSummaryResponse;
import com.nvb.fin_flow.dto.response.TransactionSummaryResponse;
import com.nvb.fin_flow.entity.QCategory;
import com.nvb.fin_flow.entity.QTransaction;
import com.nvb.fin_flow.entity.QUser;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.service.StatisticService;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class StatisticServiceImpl implements StatisticService {
    JPAQueryFactory queryFactory;
    QTransaction t = QTransaction.transaction;
    QCategory c = QCategory.category;
    QUser u = QUser.user;

    @Override
    public TransactionSummaryResponse getTransactionSummary(Map<String, String> params) {


        String username = params.get("username");
        String period = params.get("period");
        String from = params.get("from");
        String to = params.get("to");

        if (username == null || period == null || from == null || to == null) {
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }

        LocalDate startDate = convertDate(from);
        LocalDate endDate =  convertDate(to);

        TotalSummaryResponse totalSummary = getTotalSummary(username, startDate, endDate, t, c, u);

        // Lấy dữ liệu theo chuỗi thời gian (TimeSeriesData)
        List<TimeSeriesDataResponse> timeSeriesData = getTimeSeriesData(username, period, startDate, endDate, t, c, u);

        return TransactionSummaryResponse.builder().totalSummary(totalSummary).timeSeriesData(timeSeriesData).build();
    }

    @Override
    public List<CategoryDistribution> getCategoryDistribution(Map<String, String> params) {
        String username = params.get("username");
        String from = params.get("from");
        String to = params.get("to");
        String type = params.get("type");

        if (username == null ||  from == null || to == null) {
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }
        CategoryType categoryType;
        try{
            categoryType = CategoryType.valueOf(type);
        }catch (IllegalArgumentException e){
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }
        LocalDate startDate = convertDate(from);
        LocalDate endDate =  convertDate(to);

        BigDecimal totalAmount = queryFactory
                .select(t.amount.sum())
                .from(t)
                .join(t.category, c)
                .join(t.user, u)
                .where(c.type.eq(CategoryType.EXPENSE)
                        .and(t.date.between(startDate, endDate))
                        .and(u.username.eq(username)))
                .fetchOne();

        if(totalAmount == null || totalAmount.intValue() == 0){
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

    private TotalSummaryResponse getTotalSummary(String username, LocalDate startDate, LocalDate endDate,
                                                 QTransaction t, QCategory c, QUser u) {
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

    private List<TimeSeriesDataResponse> getTimeSeriesData(String username, String period, LocalDate startDate,
                                                           LocalDate endDate, QTransaction t, QCategory c, QUser u) {

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

    private LocalDate convertDate(String date){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        try {
            return LocalDate.parse(date, formatter);
        } catch (DateTimeParseException e) {
            throw new AppException(ErrorCode.INVALID_DATE_FORMAT);
        }
    }
}
