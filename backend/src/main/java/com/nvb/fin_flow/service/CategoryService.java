package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.response.CategoryPageableResponse;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.enums.CategoryType;

import java.util.Map;
import java.util.Set;

public interface CategoryService {
    CategoryPageableResponse getCategories(Map<String, String> params);
    CategoryResponse addOrUpdateCategory(CategoryCreationRequest categoryCreationRequest);
    void deleteCategory(String id);
    CategoryResponse getCategoryById(String id);
}
