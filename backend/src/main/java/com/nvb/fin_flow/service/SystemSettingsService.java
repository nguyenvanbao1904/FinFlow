package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.response.SystemSettingResponse;
import com.nvb.fin_flow.enums.SystemSettingKey;

import java.util.List;

public interface SystemSettingsService {
    String getSettingValue(SystemSettingKey key);
    void setSettingValue(String key, String value);
    List<SystemSettingResponse> getSystemSettings();
}
