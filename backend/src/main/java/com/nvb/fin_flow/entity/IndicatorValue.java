package com.nvb.fin_flow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "indicator_value", indexes = {
        @Index(name = "idx_indicator_value_company_period", columnList = "company_id, financial_period_id"),
        @Index(name = "idx_indicator_value_type", columnList = "indicator_type_id")
})
public class IndicatorValue extends BaseReport {
    Double value;
    @ManyToOne
    @JoinColumn(name = "indicator_type_id")
    IndicatorType indicatorType;
}
