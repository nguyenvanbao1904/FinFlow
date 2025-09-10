package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.response.IndustryResponse;
import com.nvb.fin_flow.entity.Industry;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IndustryMapper {
    IndustryResponse toResponse(Industry industry);
}
