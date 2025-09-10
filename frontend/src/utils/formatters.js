export const formatCurrency = (value, options = {}) => {
  if (value === undefined || value === null || value === "N/A") return "N/A";

  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return "N/A";

  if (options.isPercentage) return `${(numericValue * 100).toFixed(2)}%`;

  if (numericValue >= 1e9) return `${(numericValue / 1e9).toFixed(1)} tỷ`;
  if (numericValue >= 1e6) return `${(numericValue / 1e6).toFixed(1)} triệu`;

  return numericValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// Export legacy functions for compatibility
export const formatPercentage = (value, precision = 2) => {
  return formatCurrency(value, { isPercentage: true });
};

export const formatSimpleCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
