import { groupByPeriod } from "../../utils/dataHelpers";

// ✅ Default colors cho multiple indicators
const DEFAULT_COLORS = [
  "#e600e6",
  "#00b300",
  "#ff9933",
  "#33ccff",
  "#ff6666",
  "#66ff66",
];

export const transformMultipleIndicatorData = (
  data,
  indicators,
  typePeriod = "YEARLY"
) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [] };
  }

  const allFilteredData = data.filter((item) =>
    indicators.includes(item.type?.name)
  );

  if (allFilteredData.length === 0) {
    return { labels: [], datasets: [] };
  }

  const groupedByPeriod = groupByPeriod(allFilteredData, typePeriod);
  const sortedPeriods = Object.values(groupedByPeriod).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.quarter - b.quarter;
  });

  const datasets = indicators.map((indicatorName, index) => ({
    label: indicatorName,
    data: sortedPeriods.map((period) => period.items[indicatorName] || 0),
    borderColor: DEFAULT_COLORS[index % DEFAULT_COLORS.length], // ✅ Thêm màu
    backgroundColor: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    fill: false,
    tension: 0.4,
    borderWidth: 2,
    pointRadius: 0,
    hoverRadius: 7,
    type: "line",
  }));

  return {
    labels: sortedPeriods.map((p) => p.period),
    datasets,
  };
};
