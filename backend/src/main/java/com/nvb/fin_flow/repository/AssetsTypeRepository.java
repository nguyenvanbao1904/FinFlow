package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.AssetsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetsTypeRepository extends JpaRepository<AssetsType, String> {
}
