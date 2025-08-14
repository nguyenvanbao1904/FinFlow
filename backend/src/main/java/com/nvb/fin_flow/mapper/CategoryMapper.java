package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.repository.projection.CategoryWithIcon;
import com.nvb.fin_flow.repository.projection.CategoryWithIconAndCreatedBy;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(CategoryWithIconAndCreatedBy categoryWithIconAndCreatedBy);
    CategoryResponse toResponse(CategoryWithIcon categoryWithIcon);
    CategoryResponse toResponse(Category category);
    Category toEntity(CategoryCreationRequest categoryCreationRequest);
    CategoryCreationRequest toCategoryCreationRequest(CategoryResponse categoryResponse);
}
