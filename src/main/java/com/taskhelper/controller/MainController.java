package com.taskhelper.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("register")
    public String registerForm() {
        return "auth/register";
    }

    @GetMapping("login")
    public String loginForm() {
        return "auth/login";
    }

    @GetMapping("dashboard")
    public String dashboard() {
        return "dashboard";
    }
}