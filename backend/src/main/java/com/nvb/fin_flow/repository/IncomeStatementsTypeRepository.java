package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.IncomeStatementsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncomeStatementsTypeRepository extends JpaRepository<IncomeStatementsType, String> {
}
