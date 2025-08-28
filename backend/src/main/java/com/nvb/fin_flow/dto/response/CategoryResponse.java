package com.nvb.fin_flow.dto.response;

import com.nvb.fin_flow.enums.CategoryType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    String id;
    String name;
    String colorCode;
    CategoryType type;
    String userUsername;
    IconResponse icon;
}
