package com.nvb.fin_flow.controller;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.request.IconCreationRequest;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.dto.response.IconPageableResponse;
import com.nvb.fin_flow.dto.response.CategoryPageableResponse;
import com.nvb.fin_flow.dto.response.IconResponse;
import com.nvb.fin_flow.entity.Icon;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.mapper.CategoryMapper;
import com.nvb.fin_flow.service.CategoryService;
import com.nvb.fin_flow.service.IconService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class AdminController {
    CategoryService categoryService;
    IconService iconService;
    CategoryMapper categoryMapper;

    @GetMapping("/")
    public String dashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String users() {
        return "admin/userManagement";
    }

    @GetMapping("/categories")
    public String getCategories(Model model, Authentication authentication, @RequestParam Map<String, String> params) {
        params.put("username", authentication.getName());

        // Đảm bảo có page parameter cho từng loại, default là "1"
        String expensePage = params.getOrDefault("expensePage", "1");
        String incomePage = params.getOrDefault("incomePage", "1");
        String savingPage = params.getOrDefault("savingPage", "1");

        // Lấy categories theo từng loại với pagination riêng
        Map<String, String> expenseParams = new HashMap<>(params);
        expenseParams.put("type", "expense");
        expenseParams.put("page", expensePage);
        CategoryPageableResponse expenseResponse = categoryService.getCategories(expenseParams);

        Map<String, String> incomeParams = new HashMap<>(params);
        incomeParams.put("type", "income");
        incomeParams.put("page", incomePage);
        CategoryPageableResponse incomeResponse = categoryService.getCategories(incomeParams);

        Map<String, String> savingParams = new HashMap<>(params);
        savingParams.put("type", "saving");
        savingParams.put("page", savingPage);
        CategoryPageableResponse savingResponse = categoryService.getCategories(savingParams);

        model.addAttribute("categoriesExpense", expenseResponse.getCategoryResponses());
        model.addAttribute("categoriesIncome", incomeResponse.getCategoryResponses());
        model.addAttribute("categoriesSaving", savingResponse.getCategoryResponses());

        model.addAttribute("expenseCurrentPage", Integer.parseInt(expensePage));
        model.addAttribute("expenseTotalPages", expenseResponse.getTotalPages());
        model.addAttribute("expenseHasNext", Integer.parseInt(expensePage) < expenseResponse.getTotalPages());

        model.addAttribute("incomeCurrentPage", Integer.parseInt(incomePage));
        model.addAttribute("incomeTotalPages", incomeResponse.getTotalPages());
        model.addAttribute("incomeHasNext", Integer.parseInt(incomePage) < incomeResponse.getTotalPages());

        model.addAttribute("savingCurrentPage", Integer.parseInt(savingPage));
        model.addAttribute("savingTotalPages", savingResponse.getTotalPages());
        model.addAttribute("savingHasNext", Integer.parseInt(savingPage) < savingResponse.getTotalPages());

        model.addAttribute("iconCreationRequest", new IconCreationRequest());
        model.addAttribute("icons", iconService.getIconsNonPageable());
        model.addAttribute("categoryCreationRequest", new CategoryCreationRequest());

        return "admin/categoryManagement";
    }

    @GetMapping("/categories/{id}")
    public String getCategory(@PathVariable("id") String id, Model model) {
        CategoryCreationRequest categoryCreationRequest = categoryMapper
                .toCategoryCreationRequest(categoryService.getCategoryById(id));

        Set<IconResponse> icons = iconService.getIconsNonPageable();

        model.addAttribute("categoryCreationRequest", categoryCreationRequest);
        model.addAttribute("icons", icons);

        return "admin/categoryManagementEdit";
    }

    @PostMapping("/categories")
    public String addCategory(
            @ModelAttribute("categoryCreationRequest") @Valid CategoryCreationRequest categoryCreationRequest) {
        categoryService.addOrUpdateCategory(categoryCreationRequest);
        return "redirect:/categories";
    }

    @PostMapping("/icons")
    public String addIcon(@ModelAttribute("iconCreationRequest") @Valid IconCreationRequest iconCreationRequest) {
        iconService.addIcon(iconCreationRequest);
        return "redirect:/categories";
    }

    @GetMapping("/notifications")
    public String notification() {
        return "admin/notifications";
    }

    @GetMapping("/login")
    public String login(Authentication authentication) {
        if (authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            return "redirect:/";
        }
        return "admin/login";
    }
}