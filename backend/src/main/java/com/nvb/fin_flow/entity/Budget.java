package com.nvb.fin_flow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.nvb.fin_flow.enums.RecurringType;
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
public class Budget extends BaseTable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    BigDecimal amountLimit;
    LocalDate startDate;
    LocalDate endDate;
    Boolean isRecurring;
    LocalDate nextRecurrenceDate;
    @Enumerated(EnumType.STRING)
    RecurringType recurringType;
    @Builder.Default
    Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
