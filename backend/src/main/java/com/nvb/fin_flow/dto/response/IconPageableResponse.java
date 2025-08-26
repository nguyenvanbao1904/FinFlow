package com.nvb.fin_flow.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IconPageableResponse {
    Set<IconResponse> iconResponses;
    int totalPages;
}
