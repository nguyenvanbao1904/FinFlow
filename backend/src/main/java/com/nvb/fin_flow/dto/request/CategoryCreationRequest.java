package com.nvb.fin_flow.dto.request;

import com.nvb.fin_flow.entity.Icon;
import com.nvb.fin_flow.enums.CategoryType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryCreationRequest {
    String id;
    String name;
    CategoryType type;
    String colorCode;
    Icon icon;
}
