package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.Icon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IconRepository extends JpaRepository<Icon,String> {
    Optional<Icon> findByName(String name);
}
