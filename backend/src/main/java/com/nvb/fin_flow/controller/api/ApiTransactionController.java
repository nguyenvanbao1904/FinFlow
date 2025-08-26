package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.request.TransactionCreationRequest;
import com.nvb.fin_flow.dto.response.ApiResponse;
import com.nvb.fin_flow.dto.response.TransactionPageableResponse;
import com.nvb.fin_flow.dto.response.TransactionResponse;
import com.nvb.fin_flow.service.TransactionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiTransactionController {
    TransactionService transactionService;

    @GetMapping
    public ApiResponse<TransactionPageableResponse> list(@RequestParam Map<String, String> params, Authentication authentication) {
        params.put("username", authentication.getName());
        return ApiResponse.<TransactionPageableResponse>builder()
                .code(200)
                .message("get transactions success")
                .data(transactionService.getTransactions(params))
                .build();
    }
    @PostMapping
    public ApiResponse<TransactionResponse> create(@RequestBody @Valid TransactionCreationRequest transactionCreationRequest) {
        return ApiResponse.<TransactionResponse>builder()
                .code(201)
                .message("create transaction success")
                .data(transactionService.addOrUpdateTransaction(transactionCreationRequest))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> destroy(@PathVariable String id) {
        transactionService.deleteTransaction(id);
        return ApiResponse.<Void>builder().code(204).message("Remove transaction successfully ").build();
    }

    @GetMapping("/{id}")
    public ApiResponse<TransactionResponse> retrieve(@PathVariable String id) {
        return ApiResponse.<TransactionResponse>builder()
                .code(200)
                .message("get transaction successfully")
                .data(transactionService.getTransaction(id))
                .build();
    }

}
