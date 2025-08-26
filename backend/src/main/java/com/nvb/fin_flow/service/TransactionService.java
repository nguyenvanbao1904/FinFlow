package com.nvb.fin_flow.service;

import com.nvb.fin_flow.dto.request.TransactionCreationRequest;
import com.nvb.fin_flow.dto.response.TransactionPageableResponse;
import com.nvb.fin_flow.dto.response.TransactionResponse;

import java.util.Map;
import java.util.Set;

public interface TransactionService {
    TransactionPageableResponse getTransactions(Map<String, String> params);
    TransactionResponse addOrUpdateTransaction(TransactionCreationRequest transactionCreationRequest);
    void deleteTransaction(String id);
    TransactionResponse getTransaction(String id);
}
