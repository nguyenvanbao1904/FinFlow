package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.Budget;
import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget,String> {
    Optional<Budget> findByUserAndCategoryAndStartDateAndEndDate(
            User user, Category category, LocalDate startDate, LocalDate endDate
    );
}
