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
@Table(name = "assets_report", indexes = {
        @Index(name = "idx_assets_report_company_period", columnList = "company_id, financial_period_id"),
        @Index(name = "idx_assets_report_assets_type", columnList = "assets_type_id")
})
public class AssetsReport extends BaseReport {
    BigDecimal value;
    @ManyToOne
    @JoinColumn(name = "assets_type_id")
    AssetsType assetsType;
}
