package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.enums.SystemSettingKey;
import com.nvb.fin_flow.service.OtpService;
import com.nvb.fin_flow.service.SystemSettingsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class OtpServiceImpl implements OtpService {
    StringRedisTemplate redisTemplate;
    SystemSettingsService systemSettingsService;

    @Override
    public void saveOtp(String email, String otp) {
        redisTemplate.opsForValue().set("otp:" + email, otp, Integer.parseInt(systemSettingsService.getSettingValue(SystemSettingKey.OTP_EXPIRE_TIME)), TimeUnit.SECONDS);
    }
    @Override
    public String getOtp(String email) {
        return redisTemplate.opsForValue().get("otp:" + email);
    }
    @Override
    public void deleteOtp(String email) {
        redisTemplate.delete("otp:" + email);
    }
}
