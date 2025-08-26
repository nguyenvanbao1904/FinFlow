package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String>, JpaSpecificationExecutor<Category> {
    <T> Optional<T> findById(String id, Class<T> classType);
}
