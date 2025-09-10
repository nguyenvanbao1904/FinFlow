package com.nvb.fin_flow.controller.api;

import com.nvb.fin_flow.dto.response.*;
import com.nvb.fin_flow.service.BoardMemberService;
import com.nvb.fin_flow.service.CompanyService;
import com.nvb.fin_flow.service.StockShareHolderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("/api/investment/company")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiCompanyController {
    CompanyService companyService;
    StockShareHolderService stockShareHolderService;
    BoardMemberService boardMemberService;
    @GetMapping("/{code}")
    public ApiResponse<CompanyResponse> retrieve(@PathVariable String code){
        return ApiResponse.<CompanyResponse>builder()
                .code(200)
                .message("Get company by code success")
                .data(companyService.findCompanyByCode(code))
                .build();
    }

    @GetMapping("/stock-share-holder")
    public ApiResponse<Set<StockShareHolderResponse>> getStockShareHolder(@RequestParam Map<String, String> params){
        return ApiResponse.<Set<StockShareHolderResponse>>builder()
                .data(stockShareHolderService.getStockShareHolders(params))
                .code(200)
                .message("Get stock share holder success")
                .build();
    }

        @GetMapping("/board-member")
    public ApiResponse<Set<BoardMemberResponse>> getBoardMember(@RequestParam Map<String, String> params){
        return ApiResponse.<Set<BoardMemberResponse>>builder()
                .data(boardMemberService.getBoardMembers(params))
                .code(200)
                .message("Get board member success")
                .build();
    }
}
