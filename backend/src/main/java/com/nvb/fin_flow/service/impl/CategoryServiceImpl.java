package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.response.CategoryPageableResponse;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.entity.User;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.CategoryMapper;
import com.nvb.fin_flow.repository.CategoryRepository;
import com.nvb.fin_flow.repository.projection.CategoryWithIcon;
import com.nvb.fin_flow.repository.projection.CategoryWithIconAndUser;
import com.nvb.fin_flow.service.CategoryService;
import com.nvb.fin_flow.service.UserService;
import com.nvb.fin_flow.specification.CategorySpecifications;
import com.nvb.fin_flow.utilities.PageableUtility;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    UserService userService;
    PageableUtility pageableUtility;

    @Override
    public CategoryPageableResponse getCategories(Map<String, String> params) {
        Pageable page = pageableUtility.getPageable(params.get("page"), null);

        Specification<Category> spec =
                Specification.allOf(CategorySpecifications.belongToUser(params.get("username")),
                        CategorySpecifications.nameContains(params.get("q")),
                        CategorySpecifications.typeContains(params.get("type")));

        Page<CategoryWithIconAndUser> categories = categoryRepository
                .findBy(spec, q ->q.as(CategoryWithIconAndUser.class).page(page));

        return CategoryPageableResponse.builder()
                .totalPages(categories.getTotalPages())
                .categoryResponses(new LinkedHashSet<>(categories.getContent().stream().map(categoryMapper::toResponse).collect(Collectors.toList())))
                .build();
    }

    @Override
    public CategoryResponse addOrUpdateCategory(CategoryCreationRequest categoryCreationRequest) {
        Category category = categoryMapper.toEntity(categoryCreationRequest);
        User user = userService.getCurrentUser();
        category.setUser(user);
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
            Category category = categoryRepository.findById(id).orElse(null);
            if(category == null){
                throw new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "Category"));
            }
            if(!category.getUser().getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
                throw new AppException(ErrorCode.DO_NOT_HAVE_PERMISSION);
            }
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
