package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.LiabilitiesAndEquityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiabilitiesAndEquityTypeRepository extends JpaRepository<LiabilitiesAndEquityType, String> {
}
