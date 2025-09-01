package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.constant.PredefinedRole;
import com.nvb.fin_flow.dto.request.PasswordRequest;
import com.nvb.fin_flow.dto.request.UserCreationRequest;
import com.nvb.fin_flow.dto.response.UserMonthlyStatResponse;
import com.nvb.fin_flow.dto.response.UserPageableResponse;
import com.nvb.fin_flow.dto.response.UserResponse;
import com.nvb.fin_flow.entity.QUser;
import com.nvb.fin_flow.entity.Role;
import com.nvb.fin_flow.entity.User;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.UserMapper;
import com.nvb.fin_flow.repository.RoleRepository;
import com.nvb.fin_flow.repository.UserRepository;
import com.nvb.fin_flow.service.EmailService;
import com.nvb.fin_flow.service.UserService;
import com.nvb.fin_flow.specification.UserSpecifications;
import com.nvb.fin_flow.utilities.PageableUtility;
import com.nvb.fin_flow.utilities.SortUtility;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service("userDetailsService")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    JPAQueryFactory queryFactory;
    PageableUtility pageableUtility;
    SortUtility sortUtility;
    EmailService emailService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByUsernameWithRoles(username)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "User")));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getRoles().stream()
                        .map(role -> "ROLE_" + role.getName())
                        .toArray(String[]::new))
                .build();
    }

    @Override
    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getMyInfo() {
        SecurityContext context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "User")));

        var userResponse = userMapper.toUserResponse(user);
        userResponse.setNoPassword(!StringUtils.hasText(user.getPassword()));
        return userResponse;
    }

    @Override
    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        user.setRoles(roles);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(null);
        if (user == null) {
            throw new AppException(ErrorCode.ENTITY_NOT_EXISTED);
        }
        return user;
    }

    @Override
    public void createPassword(PasswordRequest passwordRequest) {
        SecurityContext context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "User")));

        if (StringUtils.hasText(user.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_EXISTED);
        }
        user.setPassword(passwordEncoder.encode(passwordRequest.getPassword()));
        userRepository.save(user);
    }

    @Override
    public long getTotalUser() {
        return userRepository.count();
    }

    @Override
    public long getTotalUserByRegisterDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.countByRegisterDateBetween(startDate, endDate);
    }

    @Override
    public long getTotalUserByLastLoginBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.countByLastLoginBetween(startDate, endDate);
    }

    @Override
    public List<UserMonthlyStatResponse> getNewUsersByMonth(int year) {
        QUser user = QUser.user;
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = startOfYear.plusYears(1);

        List<UserMonthlyStatResponse> stats = queryFactory.select(Projections.constructor(UserMonthlyStatResponse.class,
                user.registerDate.month(),
                user.id.count())).from(user)
                .where(user.registerDate.between(startOfYear, endOfYear))
                .groupBy(user.registerDate.month())
                .orderBy(user.registerDate.month().asc())
                .fetch();

        Map<Integer, Long> monthMap = stats.stream()
                .collect(Collectors.toMap(UserMonthlyStatResponse::getMonth, UserMonthlyStatResponse::getTotal));

        return IntStream.rangeClosed(1, 12)
                .mapToObj(month -> new UserMonthlyStatResponse(month, monthMap.getOrDefault(month, 0L)))
                .collect(Collectors.toList()); // Giữ thứ tự từ 1 đến 12
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UserPageableResponse getUsers(Map<String, String> params) {
        Sort sort = sortUtility.getSort(params.get("sort"));
        Pageable page = pageableUtility.getPageable(params.get("page"), sort);
        Specification<User> specification = Specification
                .allOf(
                        UserSpecifications.usernameContains(params.get("username")),
                        UserSpecifications.roleContains(params.get("role"))
                );
        Page<User> userPage = userRepository.findAll(specification, page);
        return UserPageableResponse.builder()
                .userResponses(
                        new LinkedHashSet<>(userPage.getContent().stream().map(userMapper::toUserResponse).toList()))
                .totalPages(userPage.getTotalPages())
                .build();
    }

    @Override
    public void toggleStatus(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_EXISTED));
        if (user == null || user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(PredefinedRole.ADMIN_ROLE)) || !user.getAccountVerified()) {
            throw new AppException(ErrorCode.INVALID_KEY);
        } else {
            if(user.getIsActive()){
                String emailBody = "Chào " + user.getUsername() + ",\n\n"
                        + "Chúng tôi xin thông báo rằng tài khoản FinFlow của bạn đã bị vô hiệu hóa do vi phạm chính sách của chúng tôi.\n\n"
                        + "Để được hỗ trợ, bạn vui lòng phản hồi email này hoặc liên hệ trực tiếp với chúng tôi qua địa chỉ support@finflow.com để giải thích lý do.\n\n"
                        + "Lưu ý: Nếu chúng tôi không nhận được phản hồi trong vòng 30 ngày kể từ ngày gửi email này, tài khoản của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.\n\n"
                        + "Trân trọng,\n"
                        + "Đội ngũ FinFlow";

                emailService.sendEmailWithReplyTo(
                        user.getEmail(),
                        "Thông báo: Tài khoản FinFlow của bạn đã bị vô hiệu hóa",
                        emailBody
                );
                user.setIsActive(false);
                userRepository.save(user);
            }else{
                String activationEmailBody = "Chào " + user.getUsername() + ",\n\n"
                        + "Chúng tôi xin thông báo rằng tài khoản FinFlow của bạn đã được kích hoạt trở lại.\n\n"
                        + "Bạn hiện có thể đăng nhập và sử dụng ứng dụng như bình thường.\n\n"
                        + "Trân trọng,\n"
                        + "Đội ngũ FinFlow";

                emailService.sendEmailWithReplyTo(
                        user.getEmail(),
                        "Thông báo: Tài khoản FinFlow của bạn đã được kích hoạt",
                        activationEmailBody
                );
                user.setIsActive(true);
                userRepository.save(user);
            }
        }
    }

    @Override
    public void verifyUserEmail(String email) {
        User user = this.getCurrentUser();
        user.setEmail(email);
        user.setAccountVerified(true);
        userRepository.save(user);
    }
}
