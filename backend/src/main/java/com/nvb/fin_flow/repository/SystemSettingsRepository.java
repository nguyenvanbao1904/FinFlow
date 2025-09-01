package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.SystemSetting;
import com.nvb.fin_flow.enums.SystemSettingKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSetting, String> {
    Optional<SystemSetting> findByKey(SystemSettingKey key);
}
