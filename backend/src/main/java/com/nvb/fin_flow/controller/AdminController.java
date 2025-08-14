package com.nvb.fin_flow.controller;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.request.IconCreationRequest;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.mapper.CategoryMapper;
import com.nvb.fin_flow.service.CategoryService;
import com.nvb.fin_flow.service.IconService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
        String username = "ADMIN";
        if(authentication != null){
            username = authentication.getName();
        }
        model.addAttribute("categoriesIncome", categoryService.getCategoriesByUsername(username, CategoryType.INCOME, params));
        model.addAttribute("categoriesExpense", categoryService.getCategoriesByUsername(username, CategoryType.EXPENSE, params));
        model.addAttribute("iconCreationRequest",  new IconCreationRequest());
        model.addAttribute("icons", iconService.getIcons());
        model.addAttribute("categoryCreationRequest", new CategoryCreationRequest());
        return "admin/categoryManagement";
    }

    @GetMapping("/categories/{id}")
    public String getCategory(@PathVariable("id") String id, Model model) {
        CategoryCreationRequest categoryCreationRequest = categoryMapper.toCategoryCreationRequest(categoryService.getCategoryById(id));
        model.addAttribute("categoryCreationRequest", categoryCreationRequest);
        model.addAttribute("icons",  iconService.getIcons());
        return  "admin/categoryManagementEdit";
    }


    @PostMapping("/categories")
    public String addCategory(@ModelAttribute("categoryCreationRequest") @Valid CategoryCreationRequest categoryCreationRequest) {
        categoryService.addOrCategory(categoryCreationRequest);
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
