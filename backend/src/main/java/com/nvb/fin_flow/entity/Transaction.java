package com.nvb.fin_flow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Transaction extends BaseTable{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(nullable = false)
    BigDecimal amount;
    @Column(nullable = false)
    String description;
    @Column(nullable = false)
    LocalDate date;

    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
