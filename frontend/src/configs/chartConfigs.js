export const createChartOptions = (chartType = "default") => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      // ✅ Different interaction mode for pie charts
      mode: chartType === "doughnut" ? "nearest" : "index",
      intersect: chartType === "doughnut" ? true : false,
    },
    plugins: {
      legend: {
        position: chartType === "doughnut" ? "right" : "top",
        labels: {
          color: "#A0AEC0",
          // ✅ Better legend for pie charts
          ...(chartType === "doughnut" && {
            usePointStyle: true,
            padding: 20,
            boxWidth: 12,
          }),
        },
      },
      tooltip: {
        // ✅ Better tooltip positioning for pie charts
        mode: chartType === "doughnut" ? "nearest" : "index",
        intersect: chartType === "doughnut" ? true : false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#555",
        borderWidth: 1,
        // ✅ Custom positioning for pie charts
        ...(chartType === "doughnut" && {
          position: "nearest",
          xAlign: "center",
          yAlign: "bottom",
          displayColors: true,
          cornerRadius: 6,
          caretPadding: 10,
        }),
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const rawValue = context.parsed.y ?? context.parsed;

            // ✅ Enhanced type checking and null handling
            if (rawValue === null || rawValue === undefined) {
              return chartType === "doughnut" ? "N/A" : `${label}: N/A`;
            }

            // ✅ Convert to number and validate
            const value = Number(rawValue);
            if (isNaN(value)) {
              console.warn("Invalid value for chart tooltip:", rawValue);
              return chartType === "doughnut" ? "N/A" : `${label}: N/A`;
            }

            let formatted;

            // ✅ Handle pie chart percentages
            if (chartType === "doughnut") {
              formatted = `${value.toFixed(2)}%`;
            }
            // ✅ Handle percentage values
            else if (
              label.includes("%") ||
              label.includes("YoY") ||
              label.includes("Tỷ lệ")
            ) {
              formatted = `${value.toFixed(2)}%`;
            }
            // ✅ Handle ratio indicators (ROE, ROA, etc.) - multiply by 100
            else if (
              Math.abs(value) <= 1 &&
              ["ROE", "ROA", "LNG", "LNR"].includes(label)
            ) {
              formatted = `${(value * 100).toFixed(2)}%`;
            }
            // ✅ Handle large values
            else if (value >= 1e9) {
              formatted = `${(value / 1e9).toFixed(1)} tỷ`;
            } else if (value >= 1e6) {
              formatted = `${(value / 1e6).toFixed(1)} triệu`;
            } else if (value >= 1000) {
              formatted = `${(value / 1000).toFixed(1)}K`;
            } else {
              formatted = value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              });
            }

            return chartType === "doughnut"
              ? formatted // ✅ Simplified for pie chart - just show percentage
              : `${label}: ${formatted}`;
          },
          // ✅ Custom title for pie charts
          title: (context) => {
            if (chartType === "doughnut") {
              return context[0]?.label || "";
            }
            return context[0]?.label || "";
          },
        },
      },
    },
    elements: {
      line: { tension: 0.4, borderWidth: 2 },
      point: { radius: 0, hoverRadius: 6 },
      // ✅ Arc elements for pie charts
      ...(chartType === "doughnut" && {
        arc: {
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      }),
    },
  };

  // ✅ Pie/Doughnut chart specific options
  if (chartType === "doughnut") {
    // Remove scales for pie charts
    delete baseOptions.scales;
    return baseOptions;
  }

  // ✅ Add scales for other chart types
  baseOptions.scales = {
    x: {
      ticks: { color: "#A0AEC0" },
      grid: { color: "rgba(160, 174, 192, 0.1)" },
    },
  };

  // ✅ Add dual y-axis for mixed charts với custom formatters
  if (chartType === "mixed-dual") {
    baseOptions.scales["y-left"] = {
      type: "linear",
      position: "left",
      ticks: {
        color: "#A0AEC0",
        callback: function (value) {
          // ✅ Add type checking for scale callbacks
          const numValue = Number(value);
          if (isNaN(numValue)) return value;

          if (numValue >= 1e9) {
            return `${(numValue / 1e9).toFixed(1)}T`;
          } else if (numValue >= 1e6) {
            return `${(numValue / 1e6).toFixed(1)}Tr`;
          } else if (numValue >= 1000) {
            return `${(numValue / 1000).toFixed(1)}K`;
          }
          return numValue.toLocaleString();
        },
      },
      grid: { color: "rgba(160, 174, 192, 0.1)" },
    };
    baseOptions.scales["y-right"] = {
      type: "linear",
      position: "right",
      ticks: {
        color: "#A0AEC0",
        callback: function (value) {
          // ✅ Add type checking for scale callbacks
          const numValue = Number(value);
          if (isNaN(numValue)) return value;

          if (Math.abs(numValue) > 1) {
            return `${numValue.toFixed(1)}%`;
          } else {
            return `${(numValue * 100).toFixed(1)}%`;
          }
        },
      },
      grid: { display: false },
    };
  }
  // ✅ Single Y-axis với formatting
  else if (chartType !== "doughnut") {
    baseOptions.scales.y = {
      ticks: {
        color: "#A0AEC0",
        callback: function (value) {
          // ✅ Add type checking for scale callbacks
          const numValue = Number(value);
          if (isNaN(numValue)) return value;

          if (Math.abs(numValue) <= 1) {
            return `${(numValue * 100).toFixed(1)}%`;
          } else if (numValue >= 1e9) {
            return `${(numValue / 1e9).toFixed(1)}T`;
          } else if (numValue >= 1e6) {
            return `${(numValue / 1e6).toFixed(1)}Tr`;
          } else if (numValue >= 1000) {
            return `${(numValue / 1000).toFixed(1)}K`;
          }
          return numValue.toLocaleString();
        },
      },
      grid: { color: "rgba(160, 174, 192, 0.1)" },
    };
  }

  return baseOptions;
};
