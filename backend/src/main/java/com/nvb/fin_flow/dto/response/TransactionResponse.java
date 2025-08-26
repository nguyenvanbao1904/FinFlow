package com.nvb.fin_flow.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionResponse {
    String id;
    BigDecimal amount;
    String description;
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate date;
    CategoryResponse category;
    
}
