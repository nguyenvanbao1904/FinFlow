import { groupByPeriod, filterByIndicator } from "../../utils/dataHelpers";
import { calculateMedian } from "../../utils/calculations";

// ✅ Default colors cho valuation
const VALUATION_COLORS = {
  PE: "#00ffc8",
  PB: "#66b3ff",
  PS: "#ff66a3",
  default: "#4caf50",
};

export const transformValuationData = (
  data,
  indicatorType,
  typePeriod = "YEARLY"
) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [], current: 0, median: 0, comparison: 0 };
  }

  const filteredData = filterByIndicator(data, indicatorType);
  if (filteredData.length === 0) {
    return { labels: [], datasets: [], current: 0, median: 0, comparison: 0 };
  }

  const groupedByPeriod = groupByPeriod(filteredData, typePeriod);
  const sortedPeriods = Object.values(groupedByPeriod).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.quarter - b.quarter;
  });

  const labels = sortedPeriods.map((p) => p.period);
  const values = sortedPeriods.map((p) => p.items[indicatorType] || 0);

  const historicalValues = values.slice(0, -1);
  const medianValue =
    historicalValues.length > 0
      ? calculateMedian(historicalValues)
      : values[values.length - 1];
  const currentValue = values[values.length - 1];
  const comparisonValue =
    medianValue !== 0 ? ((currentValue - medianValue) / medianValue) * 100 : 0;

  const mainColor = VALUATION_COLORS[indicatorType] || VALUATION_COLORS.default;

  return {
    labels,
    datasets: [
      {
        label: indicatorType,
        data: values,
        borderColor: mainColor, // ✅ Thêm màu
        backgroundColor: mainColor,
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: "Trung vị",
        data: Array(values.length).fill(medianValue),
        borderColor: "#FFCC00", // ✅ Thêm màu median
        backgroundColor: "#FFCC00",
        borderDash: [5, 5],
        fill: false,
        tension: 0,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
    current: currentValue,
    median: medianValue,
    comparison: comparisonValue,
  };
};
