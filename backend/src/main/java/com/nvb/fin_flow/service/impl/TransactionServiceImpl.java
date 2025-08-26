package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.dto.request.TransactionCreationRequest;
import com.nvb.fin_flow.dto.response.TransactionPageableResponse;
import com.nvb.fin_flow.dto.response.TransactionResponse;
import com.nvb.fin_flow.entity.*;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import com.nvb.fin_flow.mapper.TransactionMapper;
import com.nvb.fin_flow.repository.CategoryRepository;
import com.nvb.fin_flow.repository.TransactionRepository;
import com.nvb.fin_flow.service.TransactionService;
import com.nvb.fin_flow.service.UserService;
import com.nvb.fin_flow.specification.TransactionSpecifications;
import com.nvb.fin_flow.utilities.PageableUtility;
import com.nvb.fin_flow.utilities.SortUtility;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.stream.Collectors;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Service
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    TransactionRepository transactionRepository;
    TransactionMapper transactionMapper;
    CategoryRepository categoryRepository;
    UserService userService;
    PageableUtility pageableUtility;
    SortUtility sortUtility;

    @Override
    public TransactionPageableResponse getTransactions(Map<String, String> params) {
        Specification<Transaction> specification = Specification.allOf(
                TransactionSpecifications.belongToUser(params.get("username")),
                TransactionSpecifications.between(params.get("from"), params.get("to"))
        );

        Sort sort = sortUtility.getSort(params.get("sort"));
        Pageable page = pageableUtility.getPageable(params.get("page"), sort);

        Page<Transaction> transactions = transactionRepository.findAll(specification, page);


        return TransactionPageableResponse.builder()
                .totalPages(transactions.getTotalPages())
                .transactionResponses(new LinkedHashSet<>(transactions.getContent().stream()
                        .map(transactionMapper::toResponse).collect(Collectors.toList())))
                .build();
    }

    @Override
    public TransactionResponse addOrUpdateTransaction(TransactionCreationRequest transactionCreationRequest) {
        Transaction transaction = transactionMapper.toEntity(transactionCreationRequest);
        Category category = categoryRepository.findById(transactionCreationRequest.getCategoryId()).orElse(null);
        if (category == null) {
            throw new AppException(ErrorCode.INVALID_REFERENCE, Map.of("entity", "Category"));
        }
        transaction.setCategory(category);
        User user = userService.getCurrentUser();
        transaction.setUser(user);
        try {
            transactionRepository.save(transaction);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.SQL_EXCEPTION,
                    Map.of("ms", e.getCause().getMessage().split("\\[")[0].trim()));
        }
        return transactionMapper.toResponse(transaction);
    }

    @Override
    public void deleteTransaction(String id) {
        try{
            Transaction transaction = transactionRepository.findById(id).orElse(null);
            if(transaction == null){
                throw new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "Transaction"));
            }
            if(!transaction.getUser().getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
                throw new AppException(ErrorCode.DO_NOT_HAVE_PERMISSION);
            }
            transactionRepository.deleteById(id);
        }catch (DataIntegrityViolationException e){
            throw new AppException(ErrorCode.SQL_EXCEPTION, Map.of("ms", e.getCause().getMessage().split("\\[")[0].trim()));
        }
    }

    @Override
    public TransactionResponse getTransaction(String id) {
        Transaction transaction = transactionRepository.findById(id).orElse(null);
        if(transaction == null) {
            throw new AppException(ErrorCode.ENTITY_NOT_EXISTED, Map.of("entity", "Transaction"));
        }

        if(!transaction.getUser().getUsername().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
            throw new AppException(ErrorCode.DO_NOT_HAVE_PERMISSION);
        }
        return transactionMapper.toResponse(transaction);
    }
}
