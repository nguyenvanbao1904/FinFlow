import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  fetchCompanyOverview,
  fetchIndicatorValue,
  fetchIncomeStatement,
  fetchLiabilitiesAndEquity,
  fetchAssetsReport,
  fetchDividend,
  fetchStockShareholder,
  fetchBoardMember,
} from "../redux/features/investment/investmentThunks";
import {
  selectCompanyOverview,
  selectSelectedSymbol,
  selectIndicatorValue,
  selectIncomeStatement,
  selectLiabilitiesAndEquity,
  selectAssetsReport,
  selectDividend,
  selectStockShareholder,
  selectBoardMember,
} from "../redux/features/investment/investmentSelectors";

export const useFinancialData = () => {
  const dispatch = useDispatch();
  const selectedSymbol = useSelector(selectSelectedSymbol);

  const companyOverview = useSelector(selectCompanyOverview);
  const indicatorValue = useSelector(selectIndicatorValue);
  const incomeStatement = useSelector(selectIncomeStatement);
  const liabilitiesAndEquity = useSelector(selectLiabilitiesAndEquity);
  const assetsReport = useSelector(selectAssetsReport);
  const dividend = useSelector(selectDividend);
  const stockShareholder = useSelector(selectStockShareholder);
  const boardMember = useSelector(selectBoardMember);

  const fetchData = useCallback(
    (params = {}) => {
      if (!selectedSymbol) return;

      // Always fetch company overview when symbol changes
      dispatch(fetchCompanyOverview());
      dispatch(fetchDividend());

      // Only fetch other data if we have required params
      if (params.period) {
        dispatch(fetchIncomeStatement({ period: params.period }));
        dispatch(fetchLiabilitiesAndEquity({ period: params.period }));
        dispatch(fetchAssetsReport({ period: params.period }));
        dispatch(fetchStockShareholder());
        dispatch(fetchBoardMember());
      }

      // Only fetch indicator value if we have date range
      if (params.startDate && params.endDate && params.period) {
        dispatch(
          fetchIndicatorValue({
            startDate: params.startDate,
            endDate: params.endDate,
            period: params.period,
          })
        );
      }
    },
    [dispatch, selectedSymbol]
  );

  return {
    selectedSymbol,
    data: {
      companyOverview,
      indicatorValue,
      incomeStatement,
      liabilitiesAndEquity,
      assetsReport,
      dividend,
      stockShareholder,
      boardMember,
    },
    fetchData,
    isLoading: {
      companyOverview: companyOverview.statusLoading === "loading",
      indicatorValue: indicatorValue.statusLoading === "loading",
      incomeStatement: incomeStatement.statusLoading === "loading",
      liabilitiesAndEquity: liabilitiesAndEquity.statusLoading === "loading",
      assetsReport: assetsReport.statusLoading === "loading",
      dividend: dividend.statusLoading === "loading",
      stockShareholder: stockShareholder.statusLoading === "loading",
      boardMember: boardMember.statusLoading === "loading",
    },
    errors: {
      companyOverview: companyOverview.error,
      indicatorValue: indicatorValue.error,
      incomeStatement: incomeStatement.error,
      liabilitiesAndEquity: liabilitiesAndEquity.error,
      assetsReport: assetsReport.error,
      dividend: dividend.error,
      stockShareholder: stockShareholder.error,
      boardMember: boardMember.error,
    },
  };
};
