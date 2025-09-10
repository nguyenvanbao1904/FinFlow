package com.nvb.fin_flow.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.nvb.fin_flow.deserializer.CategoryDeserializer;
import com.nvb.fin_flow.entity.Category;
import groovyjarjarantlr4.v4.runtime.misc.NotNull;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BudgetCreationRequest {
    String id;
    @NotNull
    @Min(1000)
    BigDecimal amountLimit;
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate startDate;
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate endDate;
    @JsonDeserialize(using = CategoryDeserializer.class)
    Category category;
    @Builder.Default
    Boolean isRecurring = false;
}