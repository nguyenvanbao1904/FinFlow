import { groupByPeriod, filterByIndicator } from "../../utils/dataHelpers";
import {
  calculateCAGR,
  calculateGrowthRates,
  calculateDebtEquityRatio,
} from "../../utils/calculations";

// ✅ Color palettes cho từng loại chart - UPDATED
const COLOR_PALETTES = {
  banking: {
    assets: ["#00FF7F", "#7FFFD4", "#40E0D0", "#20B2AA", "#5F9EA0", "#4682B4"],
    capital: ["#8A2BE2", "#4B0082", "#00BFFF", "#1E90FF", "#FFD700"],
    toi: ["#b2b2b2", "#6699ff", "#8c8c8c"],
  },
  standard: {
    // ✅ UPDATED: Thêm màu cho phải thu ngắn + dài hạn
    assets: [
      "#00FF7F", // Tiền mặt - xanh lá sáng
      "#7FFFD4", // Đầu tư ngắn hạn - xanh aqua
      "#5F9EA0", // Hàng tồn kho - xanh cadet
      "#4682B4", // Tài sản cố định - xanh steel
      "#FF6B6B", // Phải thu ngắn hạn - đỏ coral
      "#FFA07A", // Phải thu dài hạn - cam light salmon
      "#FFD700", // Tài sản khác - vàng
    ],
    capital: ["#8A2BE2", "#1E90FF", "#00BFFF", "#FFD700"],
    revenue: ["#00bfff", "#ff9933"],
  },
  dividend: ["#718096", "#00BFFF", "#8A2BE2", "#FF9933"],
  line: "#FF6347",
};

// ✅ Universal mixed chart creator
export const createMixedChartData = (config) => {
  const {
    data,
    type,
    typePeriod = "YEARLY",
    indicatorName,
    isBankingSector,
    profitData,
  } = config;

  if (!Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [], cagr: "N/A", stats: null };
  }

  switch (type) {
    case "revenue-growth":
      return createRevenueGrowthChart(data, indicatorName, typePeriod);
    case "assets-structure":
      return createAssetsStructureChart(data, isBankingSector, typePeriod);
    case "capital-structure":
      return createCapitalStructureChart(data, isBankingSector, typePeriod);
    case "toi":
      return createTOIChart(data, typePeriod);
    case "dividend":
      return createDividendChart(data, profitData);
    default:
      return { labels: [], datasets: [], cagr: "N/A", stats: null };
  }
};

// ✅ Revenue/Profit Growth Pattern (Bars + YoY Line)
const createRevenueGrowthChart = (data, indicatorName, typePeriod) => {
  const filteredData = filterByIndicator(data, indicatorName);
  if (filteredData.length === 0) {
    return { labels: [], datasets: [], cagr: "N/A" };
  }

  const groupedByPeriod = groupByPeriod(filteredData, typePeriod);
  const sortedPeriods = Object.values(groupedByPeriod).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.quarter - b.quarter;
  });

  const labels = sortedPeriods.map((p) => p.period);
  const values = sortedPeriods.map((p) => p.items[indicatorName] || 0);

  if (values.every((v) => v === 0 || v === null)) {
    return { labels: [], datasets: [], cagr: "N/A" };
  }

  const growthRates = calculateGrowthRates(values);
  const cagr = calculateCAGR(values.slice(-5));

  return {
    labels,
    datasets: [
      {
        label: indicatorName === "NET_REVENUE" ? "Doanh thu" : "Lợi nhuận",
        data: values,
        backgroundColor: COLOR_PALETTES.standard.revenue[0],
        type: "bar",
        order: 2,
        yAxisID: "y-left",
      },
      {
        label: "Tăng trưởng YoY (%)",
        data: growthRates,
        borderColor: COLOR_PALETTES.standard.revenue[1],
        backgroundColor: COLOR_PALETTES.standard.revenue[1],
        fill: false,
        type: "line",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 0,
        yAxisID: "y-right",
      },
    ],
    cagr,
  };
};

// ✅ Assets Structure Pattern (Stacked Bars + Optional Line) - FIXED
const createAssetsStructureChart = (data, isBankingSector, typePeriod) => {
  const configs = {
    banking: {
      keys: [
        "CASH_AND_CASH_EQUIVALENTS",
        "BALANCES_WITH_THE_SBV",
        "INTERBANK_PLACEMENTS_AND_LOANS",
        "TRADING_SECURITIES",
        "INVESTMENT_SECURITIES",
        "LOANS_TO_CUSTOMERS",
      ],
      labels: [
        "Tiền mặt và tương đương",
        "Số dư tại NHNN",
        "Tiền gửi và cho vay TCTD",
        "Chứng khoán kinh doanh",
        "Chứng khoán đầu tư",
        "Cho vay khách hàng",
      ],
    },
    standard: {
      // ✅ UPDATED: Include receivables in main keys
      keys: [
        "CASH_AND_CASH_EQUIVALENTS",
        "SHORT_TERM_INVESTMENTS",
        "INVENTORIES",
        "FIXED_ASSETS",
        "SHORT_TERM_RECEIVABLES", // ✅ Thêm vào bars
        "LONG_TERM_RECEIVABLES", // ✅ Thêm vào bars
      ],
      receivableKeys: ["SHORT_TERM_RECEIVABLES", "LONG_TERM_RECEIVABLES"], // ✅ Vẫn giữ để tính tỷ lệ
      labels: [
        "Tiền và tương đương tiền",
        "Đầu tư ngắn hạn",
        "Hàng tồn kho",
        "Tài sản cố định",
        "Phải thu ngắn hạn", // ✅ Hiện riêng
        "Phải thu dài hạn", // ✅ Hiện riêng
        "Tài sản khác",
      ],
    },
  };

  const config = configs[isBankingSector ? "banking" : "standard"];
  const colors =
    COLOR_PALETTES[isBankingSector ? "banking" : "standard"].assets;

  const groupedByPeriod = groupByPeriod(data, typePeriod);
  const sortedPeriods = Object.values(groupedByPeriod).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.quarter - b.quarter;
  });

  // ✅ Create datasets for all main asset categories
  const datasets = config.keys.map((key, index) => ({
    label: config.labels[index],
    data: sortedPeriods.map((p) => p.items[key] || 0),
    backgroundColor: colors[index % colors.length], // ✅ Prevent index overflow
    stack: "stack1",
    type: "bar",
    order: 2,
    yAxisID: "y-left",
  }));

  // ✅ Standard sector: Add "Other Assets" + Receivable Ratio Line
  if (!isBankingSector && config.receivableKeys) {
    // ✅ Calculate "Other Assets" = Total - All known assets (including receivables)
    const otherAssetsData = sortedPeriods.map((p) => {
      const totalAssets = p.items["TOTAL_ASSETS"] || 0;
      const knownAssets = config.keys.reduce(
        (sum, key) => sum + (p.items[key] || 0),
        0
      );
      return Math.max(0, totalAssets - knownAssets);
    });

    // ✅ Add "Other Assets" bar
    datasets.push({
      label: config.labels[config.labels.length - 1], // "Tài sản khác"
      data: otherAssetsData,
      backgroundColor: colors[colors.length - 1],
      stack: "stack1",
      type: "bar",
      order: 2,
      yAxisID: "y-left",
    });

    // ✅ Calculate receivable ratio for line chart
    const receivableRatios = sortedPeriods.map((p) => {
      const totalAssets = p.items["TOTAL_ASSETS"] || 0;
      const totalReceivables = config.receivableKeys.reduce(
        (sum, key) => sum + (p.items[key] || 0),
        0
      );
      return totalAssets > 0 ? (totalReceivables / totalAssets) * 100 : 0;
    });

    // ✅ Add receivable ratio line
    datasets.push({
      label: "Tỷ lệ phải thu (%)",
      data: receivableRatios,
      borderColor: COLOR_PALETTES.line,
      backgroundColor: COLOR_PALETTES.line,
      fill: false,
      type: "line",
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 0,
      order: 0,
      yAxisID: "y-right",
    });
  }

  return {
    labels: sortedPeriods.map((p) => p.period),
    datasets,
  };
};

// ✅ Capital Structure Pattern (Stacked Bars + Debt/Equity Line)
const createCapitalStructureChart = (data, isBankingSector, typePeriod) => {
  const configs = {
    banking: {
      keys: [
        "EQUITY",
        "GOV_AND_SBV_DEBT",
        "DEPOSITS_BORROWINGS_OTHERS",
        "DEPOSITS_FROM_CUSTOMERS",
        "CONVERTIBLE_AND_OTHER_PAPERS",
      ],
      debtKeys: [
        "GOV_AND_SBV_DEBT",
        "DEPOSITS_BORROWINGS_OTHERS",
        "DEPOSITS_FROM_CUSTOMERS",
        "CONVERTIBLE_AND_OTHER_PAPERS",
      ],
      labels: [
        "Vốn chủ sở hữu",
        "Nợ Chính phủ & NHNN",
        "Tiền gửi & vay khác",
        "Tiền gửi của khách hàng",
        "Giấy tờ có giá",
      ],
    },
    standard: {
      keys: [
        "EQUITY",
        "SHORT_TERM_BORROWINGS",
        "LONG_TERM_BORROWINGS",
        "ADVANCES_FROM_CUSTOMERS",
      ],
      debtKeys: [
        "SHORT_TERM_BORROWINGS",
        "LONG_TERM_BORROWINGS",
        "ADVANCES_FROM_CUSTOMERS",
      ],
      labels: [
        "Vốn chủ sở hữu",
        "Vay ngắn hạn",
        "Vay dài hạn",
        "Người mua trả tiền trước",
      ],
    },
  };

  const config = configs[isBankingSector ? "banking" : "standard"];
  const colors =
    COLOR_PALETTES[isBankingSector ? "banking" : "standard"].capital;

  const groupedByPeriod = groupByPeriod(data, typePeriod);
  const sortedPeriods = Object.values(groupedByPeriod).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.quarter - b.quarter;
  });

  const datasets = config.keys.map((key, index) => ({
    label: config.labels[index],
    data: sortedPeriods.map((p) => p.items[key] || 0),
    backgroundColor: colors[index],
    stack: "stack1",
    type: "bar",
    order: 2,
    yAxisID: "y-left",
  }));

  const debtEquityRatios = sortedPeriods.map((p) => {
    const equity = p.items["EQUITY"] || 0;
    const totalDebt = config.debtKeys.reduce(
      (sum, key) => sum + (p.items[key] || 0),
      0
    );
    return calculateDebtEquityRatio(totalDebt, equity);
  });

  datasets.push({
    label: "Nợ/Vốn chủ sở hữu",
    data: debtEquityRatios,
    type: "line",
    fill: false,
    borderColor: "#FF3399",
    backgroundColor: "#FF3399",
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 0,
    tension: 0.4,
    order: 0,
    yAxisID: "y-right",
  });

  return {
    labels: sortedPeriods.map((p) => p.period),
    datasets,
  };
};

// ✅ TOI Pattern (Stacked Bars + Growth Line)
const createTOIChart = (data, typePeriod) => {
  const TOI_INDICATORS = [
    "NET_INTEREST_INCOME",
    "NET_FEE_AND_COMMISSION_INCOME",
    "NET_OTHER_INCOME_OR_EXPENSES",
  ];

  const groupedData = groupByPeriod(
    data.filter((item) => TOI_INDICATORS.includes(item.type?.name)),
    typePeriod
  );

  const sortedPeriods = Object.values(groupedData).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return (a.quarter || 0) - (b.quarter || 0);
  });

  if (sortedPeriods.length === 0) {
    return { labels: [], datasets: [], cagr: "N/A" };
  }

  const labels = sortedPeriods.map((p) => p.period);
  const toiValues = sortedPeriods.map(
    (p) =>
      (p.items["NET_INTEREST_INCOME"] || 0) +
      (p.items["NET_FEE_AND_COMMISSION_INCOME"] || 0) +
      (p.items["NET_OTHER_INCOME_OR_EXPENSES"] || 0)
  );

  if (toiValues.every((v) => v === 0)) {
    return { labels: [], datasets: [], cagr: "N/A" };
  }

  const cagr = calculateCAGR(toiValues.slice(-5));
  const growthRates = calculateGrowthRates(toiValues);

  const datasets = [
    {
      label: "Thu nhập lãi thuần",
      data: sortedPeriods.map((p) => p.items["NET_INTEREST_INCOME"] || 0),
      backgroundColor: COLOR_PALETTES.banking.toi[0],
      stack: "Stack 0",
      type: "bar",
      order: 2,
      yAxisID: "y-left",
    },
    {
      label: "Lãi thuần hoạt động dịch vụ",
      data: sortedPeriods.map(
        (p) => p.items["NET_FEE_AND_COMMISSION_INCOME"] || 0
      ),
      backgroundColor: COLOR_PALETTES.banking.toi[1],
      stack: "Stack 0",
      type: "bar",
      order: 2,
      yAxisID: "y-left",
    },
    {
      label: "Thu nhập hoạt động khác",
      data: sortedPeriods.map(
        (p) => p.items["NET_OTHER_INCOME_OR_EXPENSES"] || 0
      ),
      backgroundColor: COLOR_PALETTES.banking.toi[2],
      stack: "Stack 0",
      type: "bar",
      order: 2,
      yAxisID: "y-left",
    },
    {
      label: "Tăng trưởng TOI YoY (%)",
      data: growthRates,
      borderColor: "#ff9933",
      backgroundColor: "#ff9933",
      fill: false,
      type: "line",
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 0,
      order: 0,
      yAxisID: "y-right",
    },
  ];

  return { labels, datasets, cagr };
};

// ✅ Dividend Pattern (Multi Bars + Multi Lines)
const createDividendChart = (dividendData, profitData) => {
  if (!Array.isArray(dividendData) || dividendData.length === 0) {
    return { labels: [], datasets: [], stats: { cagr: "N/A", yield: "N/A" } };
  }

  const sortedDividendData = [...dividendData].sort(
    (a, b) => a.cashYear - b.cashYear
  );

  const profitByYear = {};
  if (Array.isArray(profitData)) {
    const filteredProfitData = filterByIndicator(
      profitData,
      "PROFIT_AFTER_TAX"
    );
    filteredProfitData.forEach((item) => {
      if (item.financialPeriod?.year) {
        profitByYear[item.financialPeriod.year] = item.value || 0;
      }
    });
  }

  const labels = sortedDividendData.map((item) => `${item.cashYear}`);
  const dividendValues = sortedDividendData.map((item) => item.value || 0);
  const profitValues = sortedDividendData.map(
    (item) => profitByYear[item.cashYear] || 0
  );

  const dividendYields = sortedDividendData.map((item) => {
    const profit = profitByYear[item.cashYear] || 0;
    const dividend = item.value || 0;
    return profit > 0 ? (dividend / profit) * 100 : 0;
  });

  const dividendGrowthRates = calculateGrowthRates(dividendValues);
  const dividendCagr = calculateCAGR(dividendValues.slice(-5));
  const avgDividendYield =
    dividendYields.length > 0
      ? dividendYields.reduce((sum, yieldValue) => sum + yieldValue, 0) /
        dividendYields.length
      : 0;

  const datasets = [
    {
      label: "Lợi nhuận sau thuế",
      data: profitValues,
      backgroundColor: COLOR_PALETTES.dividend[0],
      type: "bar",
      order: 2,
      yAxisID: "y-left",
    },
    {
      label: "Cổ tức trả",
      data: dividendValues,
      backgroundColor: COLOR_PALETTES.dividend[1],
      type: "bar",
      order: 1,
      yAxisID: "y-left",
    },
    {
      label: "Tỷ lệ cổ tức (%)",
      data: dividendYields,
      borderColor: COLOR_PALETTES.dividend[2],
      backgroundColor: COLOR_PALETTES.dividend[2],
      fill: false,
      type: "line",
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 0,
      yAxisID: "y-right",
      order: 0,
    },
    {
      label: "Tăng trưởng cổ tức YoY (%)",
      data: dividendGrowthRates,
      borderColor: COLOR_PALETTES.dividend[3],
      backgroundColor: COLOR_PALETTES.dividend[3],
      fill: false,
      type: "line",
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 0,
      yAxisID: "y-right",
      order: 0,
    },
  ];

  return {
    labels,
    datasets,
    stats: {
      cagr: dividendCagr,
      yield: avgDividendYield.toFixed(2),
      latestDividend: dividendValues[dividendValues.length - 1] || 0,
      latestYield: dividendYields[dividendYields.length - 1] || 0,
    },
  };
};
