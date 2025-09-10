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
public class Industry {
    @Id
    String code;
    String name;

    @OneToMany(mappedBy = "industry")
    Set<Company> companies;
}
