package com.nvb.fin_flow.repository;

import com.nvb.fin_flow.entity.Budget;
import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.entity.User;
import com.nvb.fin_flow.dto.response.BudgetResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget,String> {
    Optional<Budget> findByUserAndCategoryAndStartDateAndEndDate(
            User user, Category category, LocalDate startDate, LocalDate endDate
    );
    List<Budget> findByIsRecurringTrueAndNextRecurrenceDateLessThanEqual(LocalDate date);
    long countBudgetsByUserInPeriod(String username, LocalDate startDate, LocalDate endDate);
    List<BudgetResponse> findBudgetsWithTransactionSums(String username, LocalDate startDate, LocalDate endDate, Pageable pageable);
}