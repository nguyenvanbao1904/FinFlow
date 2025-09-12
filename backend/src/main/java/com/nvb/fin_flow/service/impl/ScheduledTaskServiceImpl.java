package com.nvb.fin_flow.service.impl;

import com.nvb.fin_flow.entity.Budget;
import com.nvb.fin_flow.entity.InvalidatedToken;
import com.nvb.fin_flow.repository.BudgetRepository;
import com.nvb.fin_flow.repository.InvalidatedTokenRepository;
import com.nvb.fin_flow.service.ScheduledTaskService;
import com.nvb.fin_flow.utilities.DateUtility;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ScheduledTaskServiceImpl implements ScheduledTaskService {
    InvalidatedTokenRepository invalidatedTokenRepository;
    BudgetRepository budgetRepository;

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    @Override
    public void cleanupExpiredTokens() {
        log.info("Starting cleanup of expired tokens...");

        LocalDateTime now = LocalDateTime.now();
        List<InvalidatedToken> expiredTokens = invalidatedTokenRepository.findByExpiryTimeBefore(now);

        if (!expiredTokens.isEmpty()) {
            invalidatedTokenRepository.deleteAll(expiredTokens);
            log.info("Deleted {} expired tokens", expiredTokens.size());
        } else {
            log.info("No expired tokens found to delete");
        }
    }

    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    @Override
    public void renewRecurringBudgets() {
        log.info("Starting renewal of recurring budgets...");

        LocalDate today = LocalDate.now();
        List<Budget> recurringBudgets = budgetRepository.findByIsRecurringTrueAndNextRecurrenceDateLessThanEqual(today);

        int renewedCount = 0;
        for (Budget budget : recurringBudgets) {
            if (budget.getRecurringType() == null) {
                log.info("Skipping budget {} - no recurring type (custom period)", budget.getId());
                continue;
            }

            if (budget.getNextRecurrenceDate() != null && !budget.getNextRecurrenceDate().isAfter(today)) {
                LocalDate newStartDate = budget.getNextRecurrenceDate();
                LocalDate newEndDate = DateUtility.calculateEndDate(newStartDate, budget.getRecurringType());
                LocalDate nextRecurrence = DateUtility.calculateNextRecurrenceDate(newStartDate, budget.getRecurringType());

                Budget newBudget = Budget.builder()
                        .amountLimit(budget.getAmountLimit())
                        .startDate(newStartDate)
                        .endDate(newEndDate)
                        .isRecurring(true)
                        .recurringType(budget.getRecurringType())
                        .nextRecurrenceDate(nextRecurrence)
                        .isActive(true)
                        .category(budget.getCategory())
                        .user(budget.getUser())
                        .build();

                budgetRepository.save(newBudget);

                budget.setNextRecurrenceDate(nextRecurrence);
                budgetRepository.save(budget);

                renewedCount++;
                log.info("Renewed {} budget {} for user {} from {} to {}",
                        budget.getRecurringType(), budget.getId(), budget.getUser().getUsername(), newStartDate, newEndDate);
            }
        }
        log.info("Renewed {} recurring budgets", renewedCount);
    }
}