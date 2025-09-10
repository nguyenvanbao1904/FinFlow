export const selectCompanyOverview = (state) =>
  state.investments.companyOverview;
export const selectSelectedSymbol = (state) =>
  state.investments.symbol.selectedSymbol;
export const selectIndicatorValue = (state) => state.investments.indicatorValue;
export const selectIncomeStatement = (state) =>
  state.investments.incomeStatement;
export const selectLiabilitiesAndEquity = (state) =>
  state.investments.liabilitiesAndEquity;
export const selectAssetsReport = (state) => state.investments.assetsReport;
export const selectDividend = (state) => state.investments.dividend;
export const selectStockShareholder = (state) =>
  state.investments.stockShareholder;
export const selectBoardMember = (state) => state.investments.boardMember;
