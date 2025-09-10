export const getComparisonText = (current, median, comparison) => {
  if (
    [current, median, comparison].some(
      (val) => val === undefined || val === null || val === "N/A"
    )
  ) {
    return "Không đủ dữ liệu";
  }

  const [currentNum, medianNum, comparisonNum] = [
    current,
    median,
    comparison,
  ].map((val) => (typeof val === "string" ? parseFloat(val) : val));

  if (
    [currentNum, medianNum, comparisonNum].some(
      (val) => isNaN(val) || val === 0
    )
  ) {
    return "Không đủ dữ liệu";
  }

  const sign = comparisonNum > 0 ? "cao hơn" : "thấp hơn";
  return `${currentNum.toFixed(2)} (${Math.abs(comparisonNum).toFixed(
    2
  )}% ${sign} trung vị ${medianNum.toFixed(2)})`;
};

export const getFlowOpinion = (comparison) => {
  if (comparison === "N/A") {
    return {
      text: "Không đủ dữ liệu",
      icon: "fas fa-info-circle",
      color: "var(--text-muted)",
    };
  }

  const comparisonValue = parseFloat(comparison);
  const absComparison = Math.abs(comparisonValue).toFixed(0);

  if (comparisonValue > 10) {
    return {
      text: `Cao hơn trung vị ${absComparison}%`,
      icon: "fas fa-arrow-alt-circle-up",
      color: "var(--expense-color)",
    };
  }

  if (comparisonValue < -10) {
    return {
      text: `Thấp hơn trung vị ${absComparison}%`,
      icon: "fas fa-arrow-alt-circle-down",
      color: "var(--success-color)",
    };
  }

  return {
    text: "Gần trung vị",
    icon: "fas fa-circle-notch",
    color: "var(--text-muted)",
  };
};

export const getCagrOpinion = (value) => {
  const numericValue = parseFloat(value);

  if (numericValue > 10) {
    return { text: "Tăng trưởng cao", color: "var(--success-color)" };
  }

  if (numericValue > 0) {
    return { text: "Tăng trưởng thấp", color: "var(--warning-color)" };
  }

  return { text: "Tăng trưởng âm", color: "var(--expense-color)" };
};
