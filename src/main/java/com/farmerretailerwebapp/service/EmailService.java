package com.farmerretailerwebapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email failed to send: " + e.getMessage());
        }
    }


    public void sendNotification(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    // The method to send the actual HTML email
    public void sendHtmlNotification(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates HTML content

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("HTML Email failed: " + e.getMessage());
        }
    }

    // The template logic to create the professional look
    public String getOrderTemplate(String title, String message, String orderId, String total, String status) {
        return "<html><body style='font-family: Arial, sans-serif; color: #333;'>" +
                "<div style='max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;'>" +
                "<h2 style='color: #16a34a; text-align: center;'>Agri-Hub " + title + "</h2>" +
                "<p>Hello,</p>" +
                "<p>" + message + "</p>" +
                "<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>" +
                "<tr style='background: #f8f9fa;'><th style='padding: 10px; border: 1px solid #ddd; text-align: left;'>Order ID</th>" +
                "<td style='padding: 10px; border: 1px solid #ddd; font-weight: bold;'>#" + orderId + "</td></tr>" +
                "<tr><th style='padding: 10px; border: 1px solid #ddd; text-align: left;'>Total Amount</th>" +
                "<td style='padding: 10px; border: 1px solid #ddd; color: #16a34a; font-weight: bold;'>₹" + total + "</td></tr>" +
                "<tr style='background: #f8f9fa;'><th style='padding: 10px; border: 1px solid #ddd; text-align: left;'>Current Status</th>" +
                "<td style='padding: 10px; border: 1px solid #ddd;'><span style='background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 5px; font-size: 12px; font-weight: bold;'>" + status + "</span></td></tr>" +
                "</table>" +
                "<p style='margin-top: 30px; font-size: 12px; color: #888; text-align: center;'>Thank you for using Agri-Hub.</p>" +
                "</div></body></html>";
    }
}