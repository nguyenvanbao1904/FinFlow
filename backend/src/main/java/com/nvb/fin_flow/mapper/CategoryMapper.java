package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.request.CategoryCreationRequest;
import com.nvb.fin_flow.dto.response.CategoryResponse;
import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.repository.projection.CategoryWithIcon;
import com.nvb.fin_flow.repository.projection.CategoryWithIconAndUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {IconMapper.class})
public interface CategoryMapper {
    @Mapping(source = "user_Username", target = "createdBy")
    CategoryResponse toResponse(CategoryWithIconAndUser categoryWithIconAndCreatedBy);
    CategoryResponse toResponse(CategoryWithIcon categoryWithIcon);
    CategoryResponse toResponse(Category category);
    Category toEntity(CategoryCreationRequest categoryCreationRequest);
    CategoryCreationRequest toCategoryCreationRequest(CategoryResponse categoryResponse);
}
