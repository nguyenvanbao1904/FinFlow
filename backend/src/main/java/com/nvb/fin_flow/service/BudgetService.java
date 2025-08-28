package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.request.BudgetCreationRequest;
import com.nvb.fin_flow.dto.response.BudgetPageableResponse;
import com.nvb.fin_flow.dto.response.BudgetResponse;

import java.util.Map;

public interface BudgetService {
    BudgetResponse addOrUpdateBudget(BudgetCreationRequest budgetCreationRequest);
    BudgetPageableResponse getBudgets(Map<String, String> params);
    void deleteBudget(String id);
}
