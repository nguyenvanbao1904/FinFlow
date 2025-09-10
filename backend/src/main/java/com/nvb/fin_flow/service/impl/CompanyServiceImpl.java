package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.response.CompanyResponse;
import com.nvb.fin_flow.entity.Company;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.CompanyMapper;
import com.nvb.fin_flow.repository.CompanyRepository;
import com.nvb.fin_flow.service.CompanyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class CompanyServiceImpl implements CompanyService {
    CompanyRepository companyRepository;
    CompanyMapper companyMapper;

    @Override
    public CompanyResponse findCompanyByCode(String code) {
        Company company = companyRepository.findByCode(code).orElse(null);
        if (company == null) {
            throw new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "company"));
        }
        return companyMapper.toResponse(company);
    }
}
