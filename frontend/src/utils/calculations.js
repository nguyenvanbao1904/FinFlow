export const calculateCAGR = (values) => {
  if (values.length < 2) return "N/A";

  const startIndex = values.findIndex((v) => v !== 0);
  if (startIndex === -1 || startIndex === values.length - 1) return "N/A";

  const startValue = values[startIndex];
  const endValue = values[values.length - 1];

  if (startValue <= 0) return "N/A";

  const yearsToCalculate = values.length - 1 - startIndex;
  return (
    (Math.pow(endValue / startValue, 1 / yearsToCalculate) - 1) *
    100
  ).toFixed(2);
};

export const calculateMedian = (values) => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

export const calculateGrowthRates = (values) => {
  return values.map((value, index) => {
    if (index === 0) return 0;
    const prevValue = values[index - 1];
    if (prevValue <= 0) return 0;
    return ((value - prevValue) / Math.abs(prevValue)) * 100;
  });
};

export const calculateDebtEquityRatio = (totalDebt, equity) => {
  if (equity <= 0) return 0;
  return totalDebt / equity;
};
