package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.request.BudgetCreationRequest;
import com.nvb.fin_flow.dto.response.BudgetResponse;
import com.nvb.fin_flow.entity.Budget;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface BudgetMapper {
    Budget toEntity(BudgetCreationRequest budgetCreationRequest);
    BudgetResponse toResponse(Budget budget);
}
