/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nvb.controllers;

import java.util.Map;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.stereotype.Controller;

/**
 *
 * @author nguyenvanbao
 */
@Controller
public class UserController {
    @GetMapping("/login")
    public String login(Model model, @RequestParam Map<String, String> params) {
        String error = params.get("error");
        if (error != null) {
            model.addAttribute("error", "Login fail");
        }
        return "login.html";
    }
}
