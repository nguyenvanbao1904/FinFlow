package com.nvb.fin_flow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "company", indexes = {
        @Index(name = "idx_company_code", columnList = "code")
})
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(unique = true)
    String code;
    String name;
    @Column(columnDefinition = "TEXT")
    String overview;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<StockShareHolder> stockShareHolders;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<BoardMember> boardMembers;

    @ManyToOne
    @JoinColumn(name = "industry_code")
    Industry industry;

    @ManyToOne
    @JoinColumn(name = "stock_exchange_id")
    StockExchange stockExchange;

    @OneToMany(mappedBy = "company")
    Set<Dividend> dividends;
}
