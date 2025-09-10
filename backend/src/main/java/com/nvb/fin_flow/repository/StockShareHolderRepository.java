package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.Company;
import com.nvb.fin_flow.entity.StockShareHolder;
import com.nvb.fin_flow.repository.projection.StockShareHolderWithCompanyAndPersonSimple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockShareHolderRepository extends JpaRepository<StockShareHolder, String> {
    List<StockShareHolderWithCompanyAndPersonSimple> findByCompanyAndPercentageGreaterThanEqualOrderByPercentageDesc(Company company, Double percentage);
}
