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
@Table(name = "person", indexes = {
        @Index(name = "idx_person_name", columnList = "name")
})
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;

    @OneToMany(mappedBy = "shareHolder", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<StockShareHolder> stockShareHolders;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<BoardMember> boardMemberships;
}
