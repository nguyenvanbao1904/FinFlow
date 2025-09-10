package com.nvb.fin_flow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "income_statement", indexes = {
        @Index(name = "idx_income_statement_company_period", columnList = "company_id, financial_period_id"),
        @Index(name = "idx_income_statement_type", columnList = "income_statements_type_id")
})
public class IncomeStatement extends BaseReport{
    BigDecimal value;
    @ManyToOne
    @JoinColumn(name = "income_statements_type_id")
    IncomeStatementsType  incomeStatementsType;
}
