package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.dto.response.CategoryPageableResponse;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

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

    @GetMapping
    public ApiResponse<CategoryPageableResponse> list(@RequestParam Map<String, String> params, Authentication authentication) {
        params.put("username", authentication.getName());
        return ApiResponse.<CategoryPageableResponse>builder()
                .code(200)
                .message("OK")
                .data(categoryService.getCategories(params))
                .build();
    }

    @PostMapping
    public ApiResponse<CategoryResponse> create(@RequestBody @Valid CategoryCreationRequest categoryCreationRequest){
        return ApiResponse.<CategoryResponse>builder()
                .code(201)
                .message("Create category successfully ")
                .data(categoryService.addOrUpdateCategory(categoryCreationRequest))
                .build();
    }
}
