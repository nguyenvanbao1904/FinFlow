package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.IndicatorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndicatorTypeRepository extends JpaRepository<IndicatorType, String> {
}
