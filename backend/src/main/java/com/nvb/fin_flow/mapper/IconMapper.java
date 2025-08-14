package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.request.IconCreationRequest;
import com.nvb.fin_flow.dto.response.IconResponse;
import com.nvb.fin_flow.entity.Icon;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IconMapper {
    IconResponse toResponse(Icon icon);
    Icon toEntity(IconCreationRequest iconCreationRequest);
}
