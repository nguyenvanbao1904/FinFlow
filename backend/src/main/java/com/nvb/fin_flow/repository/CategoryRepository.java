package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    <T> List<T> findByCreatedBy_UsernameAndType(String username, CategoryType type, Class<T> classType);
    <T> Optional<T> findById(String id, Class<T> classType);
}
