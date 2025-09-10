import { useMemo } from "react";
import { createMixedChartData } from "../services/dataTransformers/mixedChartTransformer";
import { transformValuationData } from "../services/dataTransformers/valuationTransformer";
import { transformMultipleIndicatorData } from "../services/dataTransformers/multipleIndicatorTransformer";
import { transformShareholderData } from "../services/dataTransformers/shareholderTransformer"; // ✅ New import

export const useChartData = (data, type, options = {}) => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return { labels: [], datasets: [], cagr: "N/A" };
    }

    try {
      switch (type) {
        // ✅ Mixed chart patterns
        case "revenue":
          return createMixedChartData({
            data,
            type: "revenue-growth",
            indicatorName: options.indicatorName,
            typePeriod: options.typePeriod || "YEARLY",
          });

        case "capitalStructure":
          return createMixedChartData({
            data,
            type: "capital-structure",
            isBankingSector: options.isBankingSector,
            typePeriod: options.typePeriod || "YEARLY",
          });

        case "assetsStructure":
          return createMixedChartData({
            data,
            type: "assets-structure",
            isBankingSector: options.isBankingSector,
            typePeriod: options.typePeriod || "YEARLY",
          });

        case "toi":
          return createMixedChartData({
            data,
            type: "toi",
            typePeriod: options.typePeriod || "YEARLY",
          });

        case "dividend":
          return createMixedChartData({
            data,
            type: "dividend",
            profitData: options.profitData || [],
          });

        // ✅ Line chart patterns
        case "valuation":
          return transformValuationData(
            data,
            options.indicatorType,
            options.typePeriod || "YEARLY"
          );

        case "indicators":
          return transformMultipleIndicatorData(
            data,
            options.indicators,
            options.typePeriod || "YEARLY"
          );

        // ✅ Pie chart patterns
        case "shareholder":
          return transformShareholderData(data); // ✅ New case

        default:
          return { labels: [], datasets: [], cagr: "N/A" };
      }
    } catch (error) {
      console.error(`Error transforming chart data for type ${type}:`, error);
      return { labels: [], datasets: [], cagr: "N/A" };
    }
  }, [
    data,
    type,
    options.indicatorName,
    options.indicatorType,
    options.indicators,
    options.isBankingSector,
    options.typePeriod,
    options.profitData,
  ]);
};
