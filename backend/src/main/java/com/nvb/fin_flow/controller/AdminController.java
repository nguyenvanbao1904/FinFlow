package com.nvb.fin_flow.controller;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.request.IconCreationRequest;
import com.nvb.fin_flow.dto.request.SystemSettingCreationRequest;
import com.nvb.fin_flow.dto.response.CategoryPageableResponse;
import com.nvb.fin_flow.dto.response.IconResponse;
import com.nvb.fin_flow.dto.response.UserPageableResponse;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.mapper.CategoryMapper;
import com.nvb.fin_flow.mapper.SystemSettingMapper;
import com.nvb.fin_flow.service.CategoryService;
import com.nvb.fin_flow.service.IconService;
import com.nvb.fin_flow.service.SystemSettingsService;
import com.nvb.fin_flow.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminController {
    CategoryService categoryService;
    IconService iconService;
    CategoryMapper categoryMapper;
    UserService userService;
    SystemSettingsService systemSettingsService;

    @GetMapping("/")
    public String dashboard(Model model, @RequestParam Map<String, String> params) {
        model.addAttribute("totalUser", userService.getTotalUser());
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        long usersThisMonth = userService.getTotalUserByRegisterDateBetween(startOfMonth, endOfMonth);
        model.addAttribute("usersThisMonth", usersThisMonth);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime yesterday = now.minusHours(24);
        long usersLoggedLast24h = userService.getTotalUserByLastLoginBetween(yesterday, now);
        model.addAttribute("usersLoggedLast24h", usersLoggedLast24h);

        String year = params.getOrDefault("year", LocalDate.now().getYear() + "");
        model.addAttribute("statistics", userService.getNewUsersByMonth(Integer.parseInt(year)));
        return "admin/dashboard";
    }

    @GetMapping("/users")
    public String users(Model model, @RequestParam Map<String, String> params) {
        UserPageableResponse users = userService.getUsers(params);
        model.addAttribute("users", users.getUserResponses());
        model.addAttribute("totalPageUser", users.getTotalPages());
        int currentPage = Integer.parseInt(params.getOrDefault("page", "1"));
        model.addAttribute("currentPageUser", currentPage);
        return "admin/userManagement";
    }

    @PostMapping("/users/toggleStatus")
    public String toggleStatus(@RequestParam("userId") String userId) {
        userService.toggleStatus(userId);
        return "redirect:/users";
    }

    @GetMapping("/categories")
    public String getCategories(Model model, Authentication authentication, @RequestParam Map<String, String> params) {
        params.put("username", authentication.getName());

        // Thiết lập giá trị mặc định để tránh lỗi Thymeleaf khi null
        setDefaultCategoryAttributes(model);

        if (isSingleTypeSearch(params)) {
            handleCategory(model, params, params.get("type"), "page");
        } else {
            for (CategoryType categoryType : CategoryType.values()) {
                String type = categoryType.name().toLowerCase();
                String pageKey = type + "Page";
                handleCategory(model, params, type, pageKey);
            }
        }

        model.addAttribute("iconCreationRequest", new IconCreationRequest());
        model.addAttribute("icons", iconService.getIconsNonPageable());
        model.addAttribute("categoryCreationRequest", new CategoryCreationRequest());

        return "admin/categoryManagement";
    }

    private boolean isSingleTypeSearch(Map<String, String> params) {
        return params.containsKey("type") && !"all".equalsIgnoreCase(params.get("type"));
    }

    private void handleCategory(Model model, Map<String, String> params, String type, String pageKey) {
        String page = params.getOrDefault(pageKey, "1");
        Map<String, String> typeParams = new HashMap<>(params);
        typeParams.put("type", type);
        typeParams.put("page", page);

        CategoryPageableResponse response = categoryService.getCategories(typeParams);

        String capitalizedType = capitalize(type);
        model.addAttribute("categories" + capitalizedType, response.getCategoryResponses());
        model.addAttribute(type + "CurrentPage", Integer.parseInt(page));
        model.addAttribute(type + "TotalPages", response.getTotalPages());
        model.addAttribute(type + "HasNext", Integer.parseInt(page) < response.getTotalPages());
    }

    private void setDefaultCategoryAttributes(Model model) {
        for (CategoryType categoryType : CategoryType.values()) {
            String type = categoryType.name().toLowerCase();
            model.addAttribute(type + "CurrentPage", 0);
            model.addAttribute(type + "HasNext", false);
            model.addAttribute(type + "TotalPages", 0);
            model.addAttribute("categories" + capitalize(type), null);
        }
    }

    private String capitalize(String str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
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

    @GetMapping("/system-settings")
    public String systemSettings(Model model) {
        model.addAttribute("settings", systemSettingsService.getSystemSettings());
        return "admin/systemSettings";
    }

    @PostMapping("/system-settings")
    public String updateSystemSetting(
            @ModelAttribute("systemSettingCreationRequest") @Valid SystemSettingCreationRequest systemSettingCreationRequest) {
        systemSettingsService.setSettingValue(systemSettingCreationRequest.getKey(),
                systemSettingCreationRequest.getValue());
        return "redirect:/system-settings";
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
