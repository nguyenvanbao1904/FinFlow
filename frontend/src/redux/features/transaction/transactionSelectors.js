export const selectPeriod = (state) => state.transactions.period;
export const selectTransactions = (state) => state.transactions.transactions;
export const selectSummary = (state) => state.transactions.summary;
export const selectCategoryExpenseDistribution = (state) =>
  state.transactions.categoryExpenseDistribution;
export const selectCategoryIncomeDistribution = (state) =>
  state.transactions.categoryIncomeDistribution;
