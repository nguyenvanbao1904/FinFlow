package com.nvb.fin_flow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "financial_period", indexes = {
        @Index(name = "idx_financial_period_year_quarter", columnList = "year, quarter")
})
public class FinancialPeriod {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    Integer year;
    Integer quarter;
}
