import { combineReducers } from "@reduxjs/toolkit";
import companyOverviewSlice from "./slice/companyOverviewSlice";
import symbolSlice from "./slice/symbolSlice";
import indicatorValueSlice from "./slice/indicatorValueSlice";
import incomeStatement from "./slice/incomeStatementSlice";
import liabilitiesAndEquitySlice from "./slice/liabilitiesAndEquitySlice";
import assetsReportSlice from "./slice/assetsReportSlice";
import dividendSlice from "./slice/dividendSlice";
import stockShareholderSlice from "./slice/stockShareholderSlice";
import boardMemberSlice from "./slice/boardMemberSlice";

const investmentReducer = combineReducers({
  symbol: symbolSlice,
  companyOverview: companyOverviewSlice,
  indicatorValue: indicatorValueSlice,
  incomeStatement: incomeStatement,
  liabilitiesAndEquity: liabilitiesAndEquitySlice,
  assetsReport: assetsReportSlice,
  dividend: dividendSlice,
  stockShareholder: stockShareholderSlice,
  boardMember: boardMemberSlice,
});

export default investmentReducer;
