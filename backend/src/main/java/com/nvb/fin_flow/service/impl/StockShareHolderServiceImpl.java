package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.response.StockShareHolderResponse;
import com.nvb.fin_flow.entity.Company;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.StockShareHolderMapper;
import com.nvb.fin_flow.repository.CompanyRepository;
import com.nvb.fin_flow.repository.StockShareHolderRepository;
import com.nvb.fin_flow.service.StockShareHolderService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class StockShareHolderServiceImpl implements StockShareHolderService {
    StockShareHolderRepository stockShareHolderRepository;
    CompanyRepository companyRepository;
    StockShareHolderMapper stockShareHolderMapper;
    @Override
    public Set<StockShareHolderResponse> getStockShareHolders(Map<String, String> params) {
        String code = params.get("code");
        String minPercentage = params.get("minPercentage");
        double percentage;
        if(minPercentage == null || minPercentage.isEmpty()){
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }
        try{
            percentage = Double.parseDouble(minPercentage);
        }catch (NumberFormatException e){
            throw new AppException(ErrorCode.PARAMS_INVALID);
        }

        if (code != null && !code.isEmpty()) {
            return companyRepository.findByCode(code)
                    .map(company -> stockShareHolderRepository.findByCompanyAndPercentageGreaterThanEqualOrderByPercentageDesc(company, percentage)
                            .stream()
                            .map(stockShareHolderMapper::toResponse)
                            .collect(Collectors.toCollection(LinkedHashSet::new))
                    )
                    .orElseThrow(() ->new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "company")));
        }

        throw new AppException(ErrorCode.PARAMS_INVALID);
    }
}
