package com.nvb.fin_flow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Goal extends BaseTable{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String description;
    BigDecimal targetAmount;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
