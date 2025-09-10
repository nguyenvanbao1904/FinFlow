export const sortFinancialData = (data) => {
  return [...data].sort((a, b) => {
    if (a.financialPeriod.year !== b.financialPeriod.year) {
      return a.financialPeriod.year - b.financialPeriod.year;
    }
    // Handle null quarters properly for yearly data
    const quarterA = a.financialPeriod.quarter || 0;
    const quarterB = b.financialPeriod.quarter || 0;
    return quarterA - quarterB;
  });
};

export const createPeriodLabel = (item) => {
  // Handle null quarter for yearly data
  if (item.financialPeriod.quarter && item.financialPeriod.quarter !== null) {
    return `Q${item.financialPeriod.quarter} ${item.financialPeriod.year}`;
  }
  return `${item.financialPeriod.year}`;
};

export const filterByIndicator = (data, indicatorName) => {
  return data.filter((item) => item.type?.name === indicatorName);
};

export const groupByPeriod = (data, typePeriod = "YEARLY") => {
  return data.reduce((acc, item) => {
    if (!item?.financialPeriod || !item?.type) return acc;

    const { year, quarter } = item.financialPeriod;

    // Nếu yearly view, luôn dùng năm làm key
    const period =
      typePeriod === "YEARLY"
        ? `${year}`
        : `${year}${quarter ? `Q${quarter}` : ""}`;

    if (!acc[period]) {
      acc[period] = {
        year,
        quarter: typePeriod === "YEARLY" ? 0 : quarter || 0,
        period,
        items: {},
      };
    }

    acc[period].items[item.type.name] = item.value;
    return acc;
  }, {});
};

export const getLatestFinancialData = (data, indicatorName) => {
  if (!Array.isArray(data) || data.length === 0) return "N/A";

  const filteredData = filterByIndicator(data, indicatorName);
  if (filteredData.length === 0) return "N/A";

  const latestData = sortFinancialData(filteredData).pop();
  return latestData.value;
};
