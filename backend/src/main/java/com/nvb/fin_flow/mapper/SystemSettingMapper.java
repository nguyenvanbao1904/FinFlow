package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.response.SystemSettingResponse;
import com.nvb.fin_flow.entity.SystemSetting;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SystemSettingMapper {
    SystemSettingResponse toResponse(SystemSetting systemSetting);
}
