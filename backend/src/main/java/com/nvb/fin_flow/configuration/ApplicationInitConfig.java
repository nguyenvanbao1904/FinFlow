package com.nvb.fin_flow.configuration;

import com.nvb.fin_flow.constant.PredefinedRole;
import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.entity.Icon;
import com.nvb.fin_flow.entity.Role;
import com.nvb.fin_flow.entity.User;
import com.nvb.fin_flow.enums.CategoryType;
import com.nvb.fin_flow.repository.CategoryRepository;
import com.nvb.fin_flow.repository.IconRepository;
import com.nvb.fin_flow.repository.RoleRepository;
import com.nvb.fin_flow.repository.UserRepository;
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
                                        CategoryRepository categoryRepository, IconRepository iconRepository) {
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
                iconRepository.saveAll(icons);
            }
            if(categoryRepository.count() == 0){
                Set<Category> categories = new HashSet<>();
                categories.add(Category
                                .builder()
                                .icon(iconRepository.findByName("Ăn uống").orElse(null))
                                .type(CategoryType.EXPENSE)
                                .createdBy(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                                .colorCode("#FFA500")
                                .name("Ăn uống")
                                .build());

                categories.add(Category
                        .builder()
                        .icon(iconRepository.findByName("Đi lại").orElse(null))
                        .type(CategoryType.EXPENSE)
                        .createdBy(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                        .colorCode("#2196F3")
                        .name("Đi lại")
                        .build());

                categories.add(Category
                        .builder()
                        .icon(iconRepository.findByName("Mua sắm").orElse(null))
                        .type(CategoryType.EXPENSE)
                        .createdBy(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                        .colorCode("#E91E63")
                        .name("Mua sắm")
                        .build());

                categories.add(Category
                        .builder()
                        .icon(iconRepository.findByName("Tiền lương").orElse(null))
                        .type(CategoryType.INCOME)
                        .createdBy(userRepository.findByUsername(ADMIN_USER_NAME).orElse(null))
                        .colorCode("#4CAF50")
                        .name("Tiền lương")
                        .build());

                categoryRepository.saveAll(categories);
            }
            log.info("Application initialization completed .....");
        };
    }
}
