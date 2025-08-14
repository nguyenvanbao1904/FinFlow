package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.entity.User;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.CategoryMapper;
import com.nvb.fin_flow.repository.CategoryRepository;
import com.nvb.fin_flow.repository.UserRepository;
import com.nvb.fin_flow.repository.projection.CategoryWithIcon;
import com.nvb.fin_flow.repository.projection.CategoryWithIconAndCreatedBy;
import com.nvb.fin_flow.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    UserRepository userRepository;

    @Override
    public Set<CategoryResponse> getCategoriesByUsername(String username, CategoryType type, Map<String, String> params) {
        List<CategoryWithIconAndCreatedBy> categories = categoryRepository
                .findByCreatedBy_UsernameAndType(username, type, CategoryWithIconAndCreatedBy.class);

        if (params.containsKey("q")) {
            String keyword = params.get("q").toLowerCase();
            categories = categories.stream()
                    .filter(c -> c.getName().toLowerCase().contains(keyword))
                    .toList();
        }

        if (params.containsKey("type")) {
            String typeParam = params.get("type").toUpperCase();
            if (Arrays.stream(CategoryType.values())
                    .anyMatch(p -> p.name().equals(typeParam))) {

                categories = categories.stream()
                        .filter(c -> c.getType().equalsIgnoreCase(typeParam))
                        .toList();
            }
        }

        return categories.stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toSet());
    }

    @Override
    public CategoryResponse addOrCategory(CategoryCreationRequest categoryCreationRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String username = authentication.getName();
        User createdBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "User")));
        Category category = categoryMapper.toEntity(categoryCreationRequest);
        category.setCreatedBy(createdBy);
        try{
            categoryRepository.save(category);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.SQL_EXCEPTION, Map.of("ms", e.getCause().getMessage().split("\\[")[0].trim()));
        }
        return categoryMapper.toResponse(category);
    }

    @Override
    public void deleteCategory(String id) {
        try{
            categoryRepository.deleteById(id);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.SQL_EXCEPTION, Map.of("ms", e.getCause().getMessage().split("\\[")[0].trim()));
        }
    }

    @Override
    public CategoryResponse getCategoryById(String id) {
        CategoryWithIcon category = categoryRepository.findById(id, CategoryWithIcon.class).orElse(null);
        if (category == null) {
            throw new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "Category"));
        }
        return categoryMapper.toResponse(category);
    }
}
