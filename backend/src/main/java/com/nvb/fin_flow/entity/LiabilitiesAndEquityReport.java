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
@Table(name = "liabilities_and_equity_report", indexes = {
        @Index(name = "idx_lae_report_company_period", columnList = "company_id, financial_period_id"),
        @Index(name = "idx_lae_report_type", columnList = "liabilities_and_equity_type_id")
})
public class LiabilitiesAndEquityReport extends BaseReport {
    BigDecimal value;

    @ManyToOne
    @JoinColumn(name = "liabilities_and_equity_type_id")
    LiabilitiesAndEquityType liabilitiesAndEquityType;
}
