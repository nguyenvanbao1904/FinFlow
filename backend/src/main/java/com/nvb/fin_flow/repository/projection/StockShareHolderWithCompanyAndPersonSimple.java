package com.nvb.fin_flow.repository.projection;

public interface StockShareHolderWithCompanyAndPersonSimple {
    String getId();
    Long getQuantity();
    Double getPercentage();
    String getCompany_Name();
    String getShareHolder_Name();
}
