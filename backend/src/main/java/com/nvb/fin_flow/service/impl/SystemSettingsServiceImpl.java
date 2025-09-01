package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.response.SystemSettingResponse;
import com.nvb.fin_flow.entity.SystemSetting;
import com.nvb.fin_flow.enums.SystemSettingKey;
import com.nvb.fin_flow.mapper.SystemSettingMapper;
import com.nvb.fin_flow.repository.SystemSettingsRepository;
import com.nvb.fin_flow.service.SystemSettingsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class SystemSettingsServiceImpl implements SystemSettingsService {
    SystemSettingsRepository systemSettingsRepository;
    SystemSettingMapper systemSettingMapper;
    @Override
    public String getSettingValue(SystemSettingKey key) {
        if (key == null) return null;
        return systemSettingsRepository
                .findByKey(key)
                .map(SystemSetting::getValue)
                .orElse(null);
    }

    @Override
    public void setSettingValue(String key, String value) {
        if (key == null) return;

        try {
            SystemSettingKey enumKey = SystemSettingKey.valueOf(key.toUpperCase());

            systemSettingsRepository.findByKey(enumKey).ifPresent(setting -> {
                setting.setValue(value);
                systemSettingsRepository.save(setting);
            });

        } catch (IllegalArgumentException e) {
            // key không hợp lệ
        }
    }

    @Override
    public List<SystemSettingResponse> getSystemSettings() {
        return systemSettingsRepository.findAll().stream().map(systemSettingMapper::toResponse).toList();
    }
}
