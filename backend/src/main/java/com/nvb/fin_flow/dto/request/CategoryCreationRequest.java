package com.nvb.fin_flow.dto.request;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.nvb.fin_flow.deserializer.IconDeserializer;
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
    @JsonDeserialize(using = IconDeserializer.class)
    Icon icon;
}
