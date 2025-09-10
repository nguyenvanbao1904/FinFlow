package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.StockExchange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockExchangeRepository extends JpaRepository<StockExchange, String> {
}
