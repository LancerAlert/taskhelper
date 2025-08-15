package com.taskhelper.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("tasks")
public class TaskController {

    @GetMapping("list")
    public String list() {
        return "task/list";
    }

    @GetMapping("create")
    public String create() {
        return "task/create";
    }

    @GetMapping("detail/{id}")
    public String detail(@PathVariable("id") Long id) {
        return "task/detail";
    }

    @GetMapping("my")
    public String my() {
        return "task/my";
    }

    @GetMapping("helper")
    public String helper() {
        return "task/helper";
    }

    @GetMapping("{id}/application")
    public String application(@PathVariable("id") Long id) {
        return "task/application";
    }

}