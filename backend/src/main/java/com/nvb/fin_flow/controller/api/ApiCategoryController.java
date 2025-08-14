package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiCategoryController {
    CategoryService categoryService;
    @DeleteMapping("/{id}")
    public ApiResponse<Void> destroy(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ApiResponse.<Void>builder().code(204).message("Remove category successfully ").build();
    }
}
