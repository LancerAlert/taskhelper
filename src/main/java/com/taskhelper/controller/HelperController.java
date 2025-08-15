package com.taskhelper.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("helper")
public class HelperController {

    @GetMapping("earnings")
    public String earnings() {
        return "task/earnings";
    }
}
