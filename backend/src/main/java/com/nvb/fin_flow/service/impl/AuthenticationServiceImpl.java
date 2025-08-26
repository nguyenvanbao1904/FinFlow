package com.nvb.fin_flow.service.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nvb.fin_flow.constant.PredefinedRole;
import com.nvb.fin_flow.dto.request.AuthenticationRequest;
import com.nvb.fin_flow.dto.request.ExchangeTokenRequest;
import com.nvb.fin_flow.dto.request.IntrospectRequest;
import com.nvb.fin_flow.dto.request.LogoutRequest;
import com.nvb.fin_flow.dto.response.AuthenticationResponse;
import com.nvb.fin_flow.dto.response.IntrospectResponse;
import com.nvb.fin_flow.entity.InvalidatedToken;
import com.nvb.fin_flow.entity.Role;
import com.nvb.fin_flow.entity.User;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.repository.InvalidatedTokenRepository;
import com.nvb.fin_flow.repository.UserRepository;
import com.nvb.fin_flow.repository.httpclient.OutboundIdentityClient;
import com.nvb.fin_flow.repository.httpclient.OutboundUserClient;
import com.nvb.fin_flow.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    InvalidatedTokenRepository  invalidatedTokenRepository;
    OutboundIdentityClient outboundIdentityClient;
    OutboundUserClient outboundUserClient;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    @NonFinal
    @Value("${outbound.identity.client-id}")
    protected String CLIENT_ID;

    @NonFinal
    @Value("${outbound.identity.client-secret}")
    protected String CLIENT_SECRET;

    @NonFinal
    @Value("${outbound.identity.redirect-uri}")
    protected String REDIRECT_URI;

    @NonFinal
    protected final String GRANT_TYPE = "authorization_code";

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        boolean isValid = true;
        try{
            this.verifyToken(token, false);
        }catch (AppException e){
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "User")));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);

        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    @Override
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken =
                    InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception){
            log.info("Token already expired");
        }
    }

    @Override
    public AuthenticationResponse outboundAuthenticate(String code) {
        var response = outboundIdentityClient.exchangeToken(ExchangeTokenRequest.builder()
                .code(code)
                .clientId(CLIENT_ID)
                .clientSecret(CLIENT_SECRET)
                .redirectUri(REDIRECT_URI)
                .grantType(GRANT_TYPE)
                .build());

        log.info("TOKEN RESPONSE {}", response);

        // Get user info
        var userInfo = outboundUserClient.getUserInfo("json", response.getAccessToken());

        log.info("User Info {}", userInfo);

        Set<Role> roles = new HashSet<>();
        roles.add(Role.builder().name(PredefinedRole.USER_ROLE).build());

        // Onboard user
        var user = userRepository.findByUsername(userInfo.getEmail()).orElseGet(
                () -> userRepository.save(User.builder()
                        .username(userInfo.getEmail())
                        .firstName(userInfo.getGivenName())
                        .lastName(userInfo.getFamilyName())
                        .roles(roles)
                        .build()));

        // Generate token
        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("nvb.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
            });

        return stringJoiner.toString();
    }
}
