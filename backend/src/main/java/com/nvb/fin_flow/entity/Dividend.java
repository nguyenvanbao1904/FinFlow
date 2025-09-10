package com.nvb.fin_flow.entity;

import com.nvb.fin_flow.enums.DividendType;
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
@Table(
        name = "dividend",
        uniqueConstraints = @UniqueConstraint(columnNames = {
                "exerciseDate", "cashYear", "percentage", "method", "company_id"
        })
)
public class Dividend {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    LocalDate exerciseDate;
    Integer cashYear;
    Double percentage;
    @Enumerated(EnumType.STRING)
    DividendType method;

    @ManyToOne
    @JoinColumn(name = "company_id")
    Company company;

}

