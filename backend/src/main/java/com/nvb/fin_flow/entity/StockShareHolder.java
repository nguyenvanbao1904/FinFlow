package com.nvb.fin_flow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "stock_share_holder", indexes = {
        @Index(name = "idx_stock_share_holder_company_shareholder", columnList = "company_id, shareholder_id")
})
public class StockShareHolder {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    Company company;

    @ManyToOne
    @JoinColumn(name = "shareholder_id")
    Person shareHolder;

    Long quantity;
    Double percentage;
    LocalDate lastUpdated;
}
