package com.nvb.fin_flow.mapper;

import com.nvb.fin_flow.dto.request.TransactionCreationRequest;
import com.nvb.fin_flow.dto.response.TransactionResponse;
import com.nvb.fin_flow.entity.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses =  {CategoryMapper.class})
public interface TransactionMapper {
    Transaction toEntity(TransactionCreationRequest transactionCreationRequest);
    TransactionResponse toResponse(Transaction transaction);
}
