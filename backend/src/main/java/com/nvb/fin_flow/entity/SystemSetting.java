package com.nvb.fin_flow.entity;

import com.nvb.fin_flow.enums.SystemSettingKey;
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
public class SystemSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    @Column(unique = true, name = "setting_key")
    @Enumerated(EnumType.STRING)
    SystemSettingKey key;
    @Column(nullable = false)
    String value;
    String description;
}
