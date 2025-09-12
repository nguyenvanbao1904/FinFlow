package com.nvb.fin_flow.service;

public interface ScheduledTaskService {
    void cleanupExpiredTokens();
    void renewRecurringBudgets();
}
