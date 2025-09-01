package com.nvb.fin_flow.configuration;

import com.nvb.fin_flow.constant.PredefinedRole;
import com.nvb.fin_flow.entity.*;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.enums.SystemSettingKey;
import com.nvb.fin_flow.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    @NonFinal
    static final String USER_USER_NAME = "demoUser";

    @NonFinal
    static final String USER_PASSWORD = "123456";

    @Bean
    @ConditionalOnProperty(
            prefix = "spring",
            value = "datasource.driverClassName",
            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository,
                                        CategoryRepository categoryRepository, IconRepository iconRepository,
                                        SystemSettingsRepository systemSettingsRepository) {
        log.info("Initializing application.....");
        return args -> {
            if (userRepository.findByUsername(ADMIN_USER_NAME).isEmpty()) {
                Role userRole = roleRepository.save(Role.builder()
                        .name(PredefinedRole.USER_ROLE)
                        .description("User role")
                        .build());

                Role adminRole = roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Admin role")
                        .build());

                var rolesAdmin = new HashSet<Role>();
                rolesAdmin.add(adminRole);

                User admin = User.builder()
                        .username(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .accountVerified(true)
                        .roles(rolesAdmin)
                        .build();

                userRepository.save(admin);
                log.warn("admin user has been created with default password: admin, please change it");

                var rolesUser = new HashSet<Role>();
                rolesUser.add(userRole);
                User user = User.builder()
                        .username(USER_USER_NAME)
                        .password(passwordEncoder.encode(USER_PASSWORD))
                        .roles(rolesUser)
                        .build();

                userRepository.save(user);
                log.warn("demo user has been created with default password: 123456, please change it");
            }
            if(iconRepository.count() == 0){
                Set<Icon> icons = new HashSet<>();

                icons.add(Icon
                        .builder()
                        .iconClass("fa-solid fa-utensils")
                        .name("Ăn uống")
                        .build());

                icons.add(Icon
                        .builder()
                        .iconClass("fa-solid fa-bus")
                        .name("Đi lại")
                        .build());

                icons.add(Icon
                        .builder()
                        .iconClass("fa-solid fa-shopping-bag")
                        .name("Mua sắm")
                        .build());

                icons.add(Icon
                        .builder()
                        .iconClass("fa-solid fa-wallet")
                        .name("Tiền lương")
                        .build());

                icons.add(Icon
                        .builder()
                        .iconClass("fa-solid fa-arrow-trend-up")
                        .name("Cổ phiếu")
                        .build());

                icons.add(Icon
                        .builder()
                        .iconClass("fa-solid fa-money-bill-trend-up")
                        .name("Tiền gửi")
                        .build());
                iconRepository.saveAll(icons);
            }
            if(categoryRepository.count() == 0){
                Set<Category> categories = new HashSet<>();
                categories.add(Category
                                .builder()
                                .icon(iconRepository.findByName("Ăn uống").orElse(null))
                                .type(CategoryType.EXPENSE)
                                .user(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                                .colorCode("#FFA500")
                                .name("Ăn uống")
                                .build());

                categories.add(Category
                        .builder()
                        .icon(iconRepository.findByName("Đi lại").orElse(null))
                        .type(CategoryType.EXPENSE)
                        .user(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                        .colorCode("#2196F3")
                        .name("Đi lại")
                        .build());

                categories.add(Category
                        .builder()
                        .icon(iconRepository.findByName("Mua sắm").orElse(null))
                        .type(CategoryType.EXPENSE)
                        .user(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                        .colorCode("#E91E63")
                        .name("Mua sắm")
                        .build());

                categories.add(Category
                        .builder()
                        .icon(iconRepository.findByName("Tiền lương").orElse(null))
                        .type(CategoryType.INCOME)
                        .user(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                        .colorCode("#4CAF50")
                        .name("Tiền lương")
                        .build());

                categories.add(Category
                        .builder()
                        .icon(iconRepository.findByName("Cổ phiếu").orElse(null))
                        .type(CategoryType.SAVING)
                        .user(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                        .colorCode("#7950f2")
                        .name("Cổ phiếu")
                        .build());

                categories.add(Category
                        .builder()
                        .icon(iconRepository.findByName("Tiền gửi").orElse(null))
                        .type(CategoryType.SAVING)
                        .user(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                        .colorCode("#6c00f5")
                        .name("Tiền gửi")
                        .build());

                categoryRepository.saveAll(categories);
            }

            if(systemSettingsRepository.count() == 0){
                systemSettingsRepository.save(SystemSetting.builder()
                        .key(SystemSettingKey.PASSWORD_LENGTH_MIN)
                        .description("The minimum length for a user's password.")
                        .value("6")
                        .build());

                systemSettingsRepository.save(SystemSetting.builder()
                        .key(SystemSettingKey.PAGE_SIZE)
                        .description("The maximum number of records to display on a single page.")
                        .value("5")
                        .build());

                systemSettingsRepository.save(SystemSetting.builder()
                        .key(SystemSettingKey.OTP_EXPIRE_TIME)
                        .description("The expiration time for an OTP, in seconds.")
                        .value("60")
                        .build());

                systemSettingsRepository.save(SystemSetting.builder()
                        .key(SystemSettingKey.TOKEN_EXPIRE_TIME)
                        .description("The expiration time for an access token, in seconds.")
                        .value("3600")
                        .build());

                systemSettingsRepository.save(SystemSetting.builder()
                        .key(SystemSettingKey.TOKEN_REFRESHABLE_TIME)
                        .description("The expiration time for a refresh token, in seconds.")
                        .value("36000")
                        .build());
            }
            log.info("Application initialization completed .....");
        };
    }
}
