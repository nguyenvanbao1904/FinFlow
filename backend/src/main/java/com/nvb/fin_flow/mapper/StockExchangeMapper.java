package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.response.StockExchangeResponse;
import com.nvb.fin_flow.entity.StockExchange;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StockExchangeMapper {
    StockExchangeResponse toResponse(StockExchange stockExchange);
}
