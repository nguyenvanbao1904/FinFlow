package com.nvb.fin_flow.service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import com.nvb.fin_flow.dto.request.AuthenticationRequest;
import com.nvb.fin_flow.dto.request.IntrospectRequest;
import com.nvb.fin_flow.dto.request.LogoutRequest;
import com.nvb.fin_flow.dto.response.AuthenticationResponse;
import com.nvb.fin_flow.dto.response.IntrospectResponse;
import com.nvb.fin_flow.entity.User;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
    AuthenticationResponse authenticate(AuthenticationRequest request);
    void logout(LogoutRequest request) throws ParseException, JOSEException;
    AuthenticationResponse outboundAuthenticate(String code);
}
