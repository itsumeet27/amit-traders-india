package com.amittraders.leather.controller;

import com.amittraders.leather.dto.LookupOptionResponse;
import com.amittraders.leather.service.LeatherTypeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leather-types")
public class LeatherTypeController {

    private final LeatherTypeService leatherTypeService;

    public LeatherTypeController(LeatherTypeService leatherTypeService) {
        this.leatherTypeService = leatherTypeService;
    }

    @GetMapping
    public List<LookupOptionResponse> list() {
        return leatherTypeService.listActive();
    }
}
