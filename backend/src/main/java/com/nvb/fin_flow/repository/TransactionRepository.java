package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Set;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String>, QuerydslPredicateExecutor<Transaction>, JpaSpecificationExecutor<Transaction> {
    @EntityGraph(attributePaths = {"category", "category.icon"})
    Page<Transaction> findAll(Specification<Transaction> specification, Pageable pageable);
}
