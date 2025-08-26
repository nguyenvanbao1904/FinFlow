package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.request.IconCreationRequest;
import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.dto.response.IconPageableResponse;
import com.nvb.fin_flow.dto.response.IconResponse;
import com.nvb.fin_flow.service.IconService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/icons")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiIconController {
    IconService iconService;
    @DeleteMapping("/{id}")
    public ApiResponse<Void> destroy(@PathVariable String id) {
        iconService.deleteIcon(id);
        return ApiResponse.<Void>builder().code(204).message("Remove icon successfully ").build();
    }

    @GetMapping
    public ApiResponse<IconPageableResponse> list(@RequestParam Map<String, String> params) {
        return ApiResponse.<IconPageableResponse>builder()
                .code(200)
                .message("Successfully list icons")
                .data(iconService.getIcons(params))
                .build();
    }

    @PostMapping ApiResponse<IconResponse> create(@RequestBody @Valid IconCreationRequest iconCreationRequest) {
        return ApiResponse.<IconResponse>builder()
                .code(201)
                .message("Successfully created icon")
                .data(iconService.addIcon(iconCreationRequest))
                .build();
    }
}
