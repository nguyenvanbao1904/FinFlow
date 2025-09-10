package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.response.StockShareHolderResponse;

import java.util.Map;
import java.util.Set;

public interface StockShareHolderService {
    Set<StockShareHolderResponse>  getStockShareHolders(Map<String, String> params);
}
