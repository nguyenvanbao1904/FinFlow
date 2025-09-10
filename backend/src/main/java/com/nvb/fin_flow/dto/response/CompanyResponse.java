package com.nvb.fin_flow.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CompanyResponse {
    String id;
    String code;
    String name;
    String overview;
    IndustryResponse industry;
    StockExchangeResponse stockExchange;
}
