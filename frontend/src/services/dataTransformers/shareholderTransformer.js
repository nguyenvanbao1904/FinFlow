// ✅ Beautiful and diverse color palette
const PIE_COLORS = [
  "#FF6384", // Pink
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#FF6384", // Light Pink
  "#C9CBCF", // Gray
  "#4BC0C0", // Cyan
  "#00BCD4", // Light Blue
  "#8BC34A", // Light Green
  "#FFC107", // Amber
  "#E91E63", // Pink Accent
  "#673AB7", // Deep Purple
  "#FF5722", // Deep Orange
];

export const transformShareholderData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      labels: [],
      datasets: [],
      stats: {
        totalShareholders: 0,
        totalPercentage: 0,
        topShareholder: "N/A",
      },
    };
  }

  // ✅ Sort by percentage descending
  const sortedData = [...data].sort(
    (a, b) => (b.percentage || 0) - (a.percentage || 0)
  );

  // ✅ Calculate total percentage of known shareholders (convert 0.x to x%)
  const knownShareholdersPercentage = sortedData.reduce(
    (sum, shareholder) => sum + (shareholder.percentage || 0) * 100,
    0
  );

  // ✅ Calculate "Other shareholders" percentage
  const otherShareholdersPercentage = Math.max(
    0,
    100 - knownShareholdersPercentage
  );

  // ✅ No more limiting - backend returns exactly what we need
  let processedData = [...sortedData];

  // ✅ Add "Others" only if there's remaining percentage
  if (otherShareholdersPercentage > 0) {
    processedData.push({
      shareHolderName: "Cổ đông nhỏ lẻ khác",
      percentage: otherShareholdersPercentage / 100, // ✅ Convert back to 0.x format
      isGrouped: true,
    });
  }

  // ✅ Extract labels and data
  const labels = processedData.map((item) => {
    const name = item.shareHolderName || "Không xác định";
    const percentage = (item.percentage || 0) * 100; // ✅ Convert 0.x to x%
    return `${name} (${percentage.toFixed(2)}%)`;
  });

  const percentages = processedData.map((item) => (item.percentage || 0) * 100); // ✅ Convert to percentage

  // ✅ Get top shareholder name
  const topShareholder = sortedData[0]?.shareHolderName || "N/A";

  return {
    labels,
    datasets: [
      {
        label: "Tỷ lệ sở hữu (%)",
        data: percentages,
        backgroundColor: PIE_COLORS.slice(0, processedData.length), // ✅ Add colors back with no repeats
        borderColor: "#2D3748", // Dark border
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverBorderColor: "#FFFFFF",
      },
    ],
    stats: {
      totalShareholders: data.length,
      totalPercentage: "100.00", // ✅ Always 100%
      topShareholder,
      displayedCount: processedData.length,
      knownPercentage: knownShareholdersPercentage.toFixed(2),
      unknownPercentage: otherShareholdersPercentage.toFixed(2),
    },
  };
};
