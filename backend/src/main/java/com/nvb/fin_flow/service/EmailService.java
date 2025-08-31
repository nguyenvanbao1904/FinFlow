package com.nvb.fin_flow.service;

public interface EmailService {
    void sendEmailWithReplyTo(String to, String subject, String text);
    void sendOtpEmail(String to, String otp);
}
