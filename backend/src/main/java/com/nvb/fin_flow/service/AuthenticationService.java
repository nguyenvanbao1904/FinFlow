package com.nvb.fin_flow.service;

import com.nimbusds.jose.JOSEException;
import com.nvb.fin_flow.dto.request.AuthenticationRequest;
import com.nvb.fin_flow.dto.request.IntrospectRequest;
import com.nvb.fin_flow.dto.request.LogoutRequest;
import com.nvb.fin_flow.dto.response.AuthenticationResponse;
import com.nvb.fin_flow.dto.response.IntrospectResponse;

import java.text.ParseException;

public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
    AuthenticationResponse authenticate(AuthenticationRequest request);
    void logout(LogoutRequest request) throws ParseException, JOSEException;
    AuthenticationResponse outboundAuthenticate(String code);
}
