package com.nvb.fin_flow.entity;

import com.nvb.fin_flow.enums.CategoryType;
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
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(nullable = false, unique = true)
    String name;
    @Column(nullable = false)
    String colorCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    CategoryType type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User createdBy;

    @OneToMany(mappedBy = "category")
    Set<Budget> budgets;

    @OneToMany(mappedBy = "category")
    Set<Transaction> transactions;

    @ManyToOne
    @JoinColumn(name = "icon_id", nullable = false)
    Icon icon;

    @PrePersist
    @PreUpdate
    public void normalizeName() {
        if (name != null) {
            name = name.trim();
        }
    }
}
