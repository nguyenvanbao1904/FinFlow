package com.nvb.fin_flow.dto.response;

import com.nvb.fin_flow.enums.DividendType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DividendResponse {
    Integer cashYear;
    BigDecimal value;
    DividendType method;
    String companyName;
}
