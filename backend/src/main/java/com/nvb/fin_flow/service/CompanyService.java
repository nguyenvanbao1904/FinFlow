package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.response.CompanyResponse;

public interface CompanyService {
    CompanyResponse findCompanyByCode(String code);
}
