package com.nvb.fin_flow.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(unique = true)
    String username;
    String password;
    String firstName;
    LocalDate dob;
    String lastName;

    @CreatedDate
    @Column(name = "register_date", updatable = false)
    private LocalDateTime registerDate;

    private LocalDateTime lastLogin;

    @ManyToMany
    Set<Role> roles;

    @OneToMany(mappedBy = "user")
    Set<Transaction> transactions;

    @OneToMany(mappedBy = "user")
    Set<Category> customCategories;

    @OneToMany(mappedBy = "user")
    Set<Budget> budgets;
}
