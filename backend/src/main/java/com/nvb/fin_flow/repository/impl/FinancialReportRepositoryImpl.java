package com.nvb.fin_flow.repository.impl;

import com.nvb.fin_flow.dto.response.DividendResponse;
import com.nvb.fin_flow.dto.response.FinancialPeriodResponse;
import com.nvb.fin_flow.dto.response.FinancialReportResponse;
import com.nvb.fin_flow.dto.response.FinancialReportTypeResponse;
import com.nvb.fin_flow.entity.*;
import com.nvb.fin_flow.enums.DividendType;
import com.nvb.fin_flow.enums.FinancialPeriodType;
import com.nvb.fin_flow.repository.FinancialReportRepository;
import com.nvb.fin_flow.utilities.DateUtility;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FinancialReportRepositoryImpl implements FinancialReportRepository {

    private final JPAQueryFactory queryFactory;
    private final DateUtility dateUtility;

    QCompany c = QCompany.company;
    QFinancialPeriod fp = QFinancialPeriod.financialPeriod;
    QIndicatorValue iv = QIndicatorValue.indicatorValue;
    QIndicatorType it = QIndicatorType.indicatorType;
    QIncomeStatement is = QIncomeStatement.incomeStatement;
    QIncomeStatementsType ist = QIncomeStatementsType.incomeStatementsType;
    QLiabilitiesAndEquityReport laer = QLiabilitiesAndEquityReport.liabilitiesAndEquityReport;
    QLiabilitiesAndEquityType laert = QLiabilitiesAndEquityType.liabilitiesAndEquityType;
    QAssetsReport ar = QAssetsReport.assetsReport;
    QAssetsType art = QAssetsType.assetsType;
    QDividend d =  QDividend.dividend;

    @Override
    public List<FinancialReportResponse> getIndicatorValues(Map<String, String> params) {
        BooleanExpression whereClause = buildWhereClause(params, true);

        return queryFactory.select(
                        Projections.fields(FinancialReportResponse.class,
                                iv.id.as("id"),
                                Expressions.numberTemplate(BigDecimal.class, "{0}", iv.value).as("value"),
                                c.code.as("companyCode"),
                                Projections.fields(FinancialPeriodResponse.class,
                                        fp.year.as("year"),
                                        fp.quarter.as("quarter")).as("financialPeriod"),
                                Projections.fields(FinancialReportTypeResponse.class,
                                        it.name.as("name"),
                                        it.description.as("description")).as("type")
                        )
                )
                .from(iv)
                .join(iv.company, c)
                .join(iv.financialPeriod, fp)
                .join(iv.indicatorType, it)
                .where(whereClause)
                .orderBy(fp.year.desc(), fp.quarter.desc())
                .fetch();
    }

    @Override
    public List<FinancialReportResponse> getIncomeStatements(Map<String, String> params) {
        FinancialPeriodType periodType = FinancialPeriodType.fromString(params.get("periodType"));
        BooleanExpression whereClause = buildWhereClause(params, periodType != FinancialPeriodType.YEARLY);

        if (periodType == FinancialPeriodType.YEARLY) {
            NumberTemplate<Long> quarterCount = Expressions.numberTemplate(Long.class, "count(distinct {0})", fp.quarter);
            return queryFactory.select(
                            Projections.fields(FinancialReportResponse.class,
                                    is.value.sum().as("value"),
                                    c.code.as("companyCode"),
                                    Projections.fields(FinancialPeriodResponse.class,
                                            fp.year.as("year")).as("financialPeriod"),
                                    Projections.fields(FinancialReportTypeResponse.class,
                                            ist.name.as("name"),
                                            ist.description.as("description")).as("type")
                            )
                    )
                    .from(is)
                    .join(is.company, c)
                    .join(is.financialPeriod, fp)
                    .join(is.incomeStatementsType, ist)
                    .where(whereClause)
                    .groupBy(fp.year, ist.name, c.code, ist.description)
                    .having(quarterCount.eq(4L))
                    .orderBy(fp.year.desc())
                    .fetch();
        }

        return queryFactory.select(
                        Projections.fields(FinancialReportResponse.class,
                                is.id.as("id"),
                                Expressions.numberTemplate(BigDecimal.class, "{0}", is.value).as("value"),
                                c.code.as("companyCode"),
                                Projections.fields(FinancialPeriodResponse.class,
                                        fp.year.as("year"),
                                        fp.quarter.as("quarter")).as("financialPeriod"),
                                Projections.fields(FinancialReportTypeResponse.class,
                                        ist.name.as("name"),
                                        ist.description.as("description")).as("type")
                        )
                )
                .from(is)
                .join(is.company, c)
                .join(is.financialPeriod, fp)
                .join(is.incomeStatementsType, ist)
                .where(whereClause)
                .orderBy(fp.year.desc(), fp.quarter.desc())
                .fetch();
    }

    @Override
    public List<FinancialReportResponse> getLiabilitiesAndEquityReports(Map<String, String> params) {
        BooleanExpression whereClause = buildWhereClause(params, true);
        return queryFactory.select(
                        Projections.fields(FinancialReportResponse.class,
                                laer.id.as("id"),
                                Expressions.numberTemplate(BigDecimal.class, "{0}", laer.value).as("value"),
                                c.code.as("companyCode"),
                                Projections.fields(FinancialPeriodResponse.class,
                                        fp.year.as("year"),
                                        fp.quarter.as("quarter")).as("financialPeriod"),
                                Projections.fields(FinancialReportTypeResponse.class,
                                        laert.name.as("name"),
                                        laert.description.as("description")).as("type")
                        )
                )
                .from(laer)
                .join(laer.company, c)
                .join(laer.financialPeriod, fp)
                .join(laer.liabilitiesAndEquityType, laert)
                .where(whereClause)
                .orderBy(fp.year.desc(), fp.quarter.desc())
                .fetch();
    }

    @Override
    public List<FinancialReportResponse> getAssetsReports(Map<String, String> params) {
        BooleanExpression whereClause = buildWhereClause(params, true);
        return queryFactory.select(
                        Projections.fields(FinancialReportResponse.class,
                                ar.id.as("id"),
                                Expressions.numberTemplate(BigDecimal.class, "{0}", ar.value).as("value"),
                                c.code.as("companyCode"),
                                Projections.fields(FinancialPeriodResponse.class,
                                        fp.year.as("year"),
                                        fp.quarter.as("quarter")).as("financialPeriod"),
                                Projections.fields(FinancialReportTypeResponse.class,
                                        art.name.as("name"),
                                        art.description.as("description")).as("type")
                        )
                )
                .from(ar)
                .join(ar.company, c)
                .join(ar.financialPeriod, fp)
                .join(ar.assetsType, art)
                .where(whereClause)
                .orderBy(fp.year.desc(), fp.quarter.desc())
                .fetch();
    }

    @Override
    public List<DividendResponse> getDividends(Map<String, String> params) {
        BooleanExpression whereClause = buildWhereClause(params, true)
                .and(d.method.eq(DividendType.CASH))
                .and(it.name.eq("CPLH"));

        NumberTemplate<BigDecimal> dividendMoney = Expressions.numberTemplate(
                BigDecimal.class,
                "sum({0} * 10000 * {1})",
                d.percentage,
                iv.value
        );


        NumberTemplate<Integer> exerciseYear = Expressions.numberTemplate(Integer.class, "YEAR({0})", d.exerciseDate);
        NumberTemplate<Integer> exerciseQuarter = Expressions.numberTemplate(Integer.class, "QUARTER({0})", d.exerciseDate);


        return queryFactory.select(
                        Projections.fields(DividendResponse.class,
                                d.cashYear.as("cashYear"),
                                dividendMoney.as("value"),
                                c.name.as("name")
                        )
                )
                .from(d)
                .join(d.company, c)
                .join(iv).on(iv.company.eq(c)
                        .and(iv.financialPeriod.eq(fp))
                        .and(iv.indicatorType.eq(it))
                        .and(fp.year.eq(exerciseYear))
                        .and(fp.quarter.eq(exerciseQuarter))
                )
                .join(iv.financialPeriod, fp)
                .join(iv.indicatorType, it)
                .where(whereClause)
                .groupBy(d.cashYear, c.name)
                .orderBy(d.cashYear.desc())
                .fetch();
    }

    private BooleanExpression buildWhereClause(Map<String, String> params, boolean applyQuarter4Filter) {
        String code = params.get("code");
        if (!StringUtils.hasText(code)) {
            throw new IllegalArgumentException("Code is required");
        }

        FinancialPeriodType periodType = FinancialPeriodType.fromString(params.get("periodType"));
        NumberTemplate<Integer> periodValue = Expressions.numberTemplate(Integer.class, "{0} * 10 + {1}", fp.year, fp.quarter);
        Optional<int[]> range = calculatePeriodValues(params);

        BooleanExpression whereClause = c.code.eq(code);

        if (range.isPresent()) {
            whereClause = whereClause.and(periodValue.between(range.get()[0], range.get()[1]));
        }

        if (applyQuarter4Filter && periodType == FinancialPeriodType.YEARLY) {
            whereClause = whereClause.and(fp.quarter.eq(4));
        }

        return whereClause;
    }

    private Optional<int[]> calculatePeriodValues(Map<String, String> params) {
        String from = params.get("from");
        String to = params.get("to");

        if (!StringUtils.hasText(from) || !StringUtils.hasText(to)) {
            return Optional.empty();
        }

        try {
            LocalDate startDate = dateUtility.convertDate(from);
            LocalDate endDate = dateUtility.convertDate(to);

            int startYear = startDate.getYear();
            int endYear = endDate.getYear();
            int startQuarter = dateUtility.getQuarter(startDate);
            int endQuarter = dateUtility.getQuarter(endDate);

            int startValue = startYear * 10 + startQuarter;
            int endValue = endYear * 10 + endQuarter;

            return Optional.of(new int[]{startValue, endValue});
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
