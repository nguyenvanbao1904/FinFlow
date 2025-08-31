package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class EmailServiceImpl implements EmailService {
    JavaMailSender emailSender;

    @Override
    public void sendEmailWithReplyTo(String to, String subject, String text) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@finflow.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);

            helper.setReplyTo("support@finflow.com");

            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    @Override
    public void sendOtpEmail(String to, String otp) {
        String subject = "Your OTP Code";
        String text = "Xin chào,\n\nMã OTP của bạn là: " + otp + "\nMã này sẽ hết hạn sau 5 phút.\n\nTrân trọng!";
        sendEmailWithReplyTo(to, subject, text);
    }
}
