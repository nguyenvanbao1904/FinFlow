package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.response.CompanyResponse;
import com.nvb.fin_flow.entity.Company;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {IndustryMapper.class, StockExchangeMapper.class})
public interface CompanyMapper {
    CompanyResponse toResponse(Company company);
}
