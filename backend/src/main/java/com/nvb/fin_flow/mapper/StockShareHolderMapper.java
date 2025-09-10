package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.response.StockShareHolderResponse;
import com.nvb.fin_flow.repository.projection.StockShareHolderWithCompanyAndPersonSimple;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StockShareHolderMapper {
    @Mapping(source = "company_Name", target = "companyName")
    @Mapping(source = "shareHolder_Name", target = "shareHolderName")
    StockShareHolderResponse toResponse(StockShareHolderWithCompanyAndPersonSimple stockShareHolderWithCompanyAndPersonSimple);
}
