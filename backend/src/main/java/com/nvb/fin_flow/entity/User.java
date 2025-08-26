package com.nvb.fin_flow.entity;

import java.time.LocalDate;
import java.util.Set;

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

    @ManyToMany
    Set<Role> roles;

    @OneToMany(mappedBy = "user")
    Set<Transaction> transactions;

    @OneToMany(mappedBy = "user")
    Set<Category> customCategories;

    @OneToMany(mappedBy = "user")
    Set<Budget> budgets;

    @OneToMany(mappedBy = "user")
    Set<Goal> goals;
}
