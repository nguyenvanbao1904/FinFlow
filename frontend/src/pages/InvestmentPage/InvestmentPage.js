import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import MainHeader from "../../components/Header/MainHeader";
import ContentCard from "../../components/ContentCard/ContentCard";
import CustomChart from "../../components/Chart/CustomChart";
import Form from "../../components/Form/Form";
import FormGroup from "../../components/Form/FormGroup";
import SubmitButton from "../../components/Button/SubmitButton";
import Button from "../../components/Button/Button";

import { useFinancialData } from "../../hooks/useFinancialData";
import { useChartData } from "../../hooks/useChartData";

import { setSymbol } from "../../redux/features/investment/slice/symbolSlice";

import { formatCurrency } from "../../utils/formatters";
import { getLatestFinancialData } from "../../utils/dataHelpers";
import {
  getComparisonText,
  getFlowOpinion,
  getCagrOpinion,
} from "../../utils/financialInsights";

import { transformValuationData } from "../../services/dataTransformers/valuationTransformer";
import { transformMultipleIndicatorData } from "../../services/dataTransformers/multipleIndicatorTransformer";

import style from "./investmentPage.module.css";

const InvestmentPage = () => {
  const dispatch = useDispatch();
  const { selectedSymbol, data, fetchData, isLoading, errors } =
    useFinancialData();

  const [startDate, setStartDate] = useState(() =>
    dayjs().subtract(10, "year").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(() => dayjs().format("YYYY-MM-DD"));
  const [typePeriod, setTypePeriod] = useState("YEARLY");
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  const {
    companyOverview,
    indicatorValue,
    incomeStatement,
    liabilitiesAndEquity,
    assetsReport,
    dividend,
    stockShareholder,
    boardMember,
  } = data;

  const isBankingSector = useMemo(
    () => companyOverview.data?.industry?.name === "Ngân hàng",
    [companyOverview.data?.industry?.name]
  );

  const filteredIndicatorData = useMemo(
    () => indicatorValue.data || [],
    [indicatorValue.data]
  );

  const incomeStatementData = useMemo(
    () => incomeStatement.data || [],
    [incomeStatement.data]
  );

  const liabilitiesData = useMemo(
    () => liabilitiesAndEquity?.data || [],
    [liabilitiesAndEquity?.data]
  );

  const assetsData = useMemo(
    () => assetsReport?.data || [],
    [assetsReport?.data]
  );

  const indicators = useMemo(
    () => ({
      roe: getLatestFinancialData(filteredIndicatorData, "ROE"),
      roa: getLatestFinancialData(filteredIndicatorData, "ROA"),
      eps: getLatestFinancialData(filteredIndicatorData, "EPS"),
      bvps: getLatestFinancialData(filteredIndicatorData, "BVPS"),
      lng: getLatestFinancialData(filteredIndicatorData, "LNG"),
      lnr: getLatestFinancialData(filteredIndicatorData, "LNR"),
      cplh: getLatestFinancialData(filteredIndicatorData, "CPLH"),
    }),
    [filteredIndicatorData]
  );

  const chartOptions = useMemo(
    () => ({
      revenue: { indicatorName: "NET_REVENUE", typePeriod },
      profit: { indicatorName: "PROFIT_AFTER_TAX", typePeriod },
      toi: { typePeriod },
      dividend: { profitData: incomeStatementData },
      assetsStructure: { isBankingSector, typePeriod },
      capitalStructure: { isBankingSector, typePeriod },
    }),
    [typePeriod, incomeStatementData, isBankingSector]
  );

  const revenueChartData = useChartData(
    incomeStatementData,
    "revenue",
    chartOptions.revenue
  );
  const profitChartData = useChartData(
    incomeStatementData,
    "revenue",
    chartOptions.profit
  );
  const toiChartData = useChartData(
    isBankingSector ? incomeStatementData : [],
    "toi",
    chartOptions.toi
  );
  const dividendChartData = useChartData(
    dividend.data || [],
    "dividend",
    chartOptions.dividend
  );
  const assetsStructureData = useChartData(
    assetsData,
    "assetsStructure",
    chartOptions.assetsStructure
  );
  const capitalStructureData = useChartData(
    liabilitiesData,
    "capitalStructure",
    chartOptions.capitalStructure
  );

  const shareholderChartData = useChartData(
    stockShareholder.data || [],
    "shareholder"
  );

  const peData = useMemo(
    () => transformValuationData(filteredIndicatorData, "PE", typePeriod),
    [filteredIndicatorData, typePeriod]
  );

  const pbData = useMemo(
    () => transformValuationData(filteredIndicatorData, "PB", typePeriod),
    [filteredIndicatorData, typePeriod]
  );

  const psData = useMemo(
    () => transformValuationData(filteredIndicatorData, "PS", typePeriod),
    [filteredIndicatorData, typePeriod]
  );

  const roeRoaData = useMemo(
    () =>
      transformMultipleIndicatorData(
        filteredIndicatorData,
        ["ROE", "ROA"],
        typePeriod
      ),
    [filteredIndicatorData, typePeriod]
  );

  const profitMarginData = useMemo(
    () =>
      transformMultipleIndicatorData(
        filteredIndicatorData,
        ["LNG", "LNR"],
        typePeriod
      ),
    [filteredIndicatorData, typePeriod]
  );

  const hasValidData = useCallback((chartData) => {
    return chartData && chartData.labels && chartData.labels.length > 0;
  }, []);

  const stableFetchData = useCallback(
    (params) => {
      fetchData(params);
    },
    [fetchData]
  );

  const handleDateRangeApply = useCallback(
    (e) => {
      e.preventDefault();
      if (selectedSymbol) {
        stableFetchData({ startDate, endDate, period: typePeriod });
      }
    },
    [selectedSymbol, startDate, endDate, typePeriod, stableFetchData]
  );

  const onSubmitFindCode = useCallback(
    (e, value) => {
      e.preventDefault();
      dispatch(setSymbol(value));
    },
    [dispatch]
  );

  const handleClickPeriod = useCallback((period) => {
    setTypePeriod(period);
  }, []);

  useEffect(() => {
    if (selectedSymbol && typePeriod && !hasInitialFetch) {
      stableFetchData({ startDate, endDate, period: typePeriod });
      setHasInitialFetch(true);
    }
  }, [
    selectedSymbol,
    typePeriod,
    hasInitialFetch,
    startDate,
    endDate,
    stableFetchData,
  ]);

  useEffect(() => {
    setHasInitialFetch(false);
  }, [selectedSymbol]);

  useEffect(() => {
    if (selectedSymbol && hasInitialFetch && typePeriod) {
      const timeoutId = setTimeout(() => {
        stableFetchData({ startDate, endDate, period: typePeriod });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [
    startDate,
    endDate,
    selectedSymbol,
    hasInitialFetch,
    typePeriod,
    stableFetchData,
  ]);

  const renderLoadingState = useCallback(
    (message) => (
      <div className={style.loadingContainer}>
        <i className="fas fa-spinner fa-spin fa-2x"></i>
        <p>{message}</p>
      </div>
    ),
    []
  );

  const renderNoDataState = useCallback(
    (message) => (
      <div className={style.noDataContainer}>
        <i className="fas fa-chart-line fa-2x"></i>
        <p>{message}</p>
      </div>
    ),
    []
  );

  const renderChart = useCallback(
    (data, type, isLoading = false, loadingMessage = "") => {
      if (isLoading) return renderLoadingState(loadingMessage);
      if (!hasValidData(data))
        return renderNoDataState("Không có dữ liệu để hiển thị");

      return (
        <div className={style.chartWrapper}>
          <CustomChart data={data} type={type} />
        </div>
      );
    },
    [renderLoadingState, renderNoDataState, hasValidData]
  );

  const indicatorConfig = useMemo(
    () => ({
      ROE: [indicators.roe, true],
      ROA: [indicators.roa, true],
      EPS: [indicators.eps, false],
      BVPS: [indicators.bvps, false],
      ...(isBankingSector
        ? {}
        : {
            LNG: [indicators.lng, true],
            LNR: [indicators.lnr, true],
          }),
      CPLH: [indicators.cplh, false],
    }),
    [indicators, isBankingSector]
  );

  const renderKeyIndicators = useCallback(() => {
    return Object.entries(indicatorConfig).map(
      ([key, [value, isPercentage]]) => (
        <div className={style.valuationItem} key={key}>
          <p>{key}</p>
          <p>{formatCurrency(value, { isPercentage })}</p>
        </div>
      )
    );
  }, [indicatorConfig]);

  const valuationData = useMemo(
    () => [
      ["Định giá P/E", peData.comparison],
      ["Định giá P/B", pbData.comparison],
      ["Định giá P/S", psData.comparison],
    ],
    [peData.comparison, pbData.comparison, psData.comparison]
  );

  const renderFinFlowView = useCallback(() => {
    return valuationData.map(([label, comparison]) => {
      const opinion = getFlowOpinion(comparison);
      return (
        <div className={style.valuationItem} key={label}>
          <p>{label}</p>
          <p style={{ color: opinion.color }}>
            <i className={`${opinion.icon} ${style.icon}`}></i> {opinion.text}
          </p>
        </div>
      );
    });
  }, [valuationData]);

  const renderBoardMembers = useCallback(() => {
    const boardData = boardMember.data || [];

    if (boardData.length === 0) {
      return (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <i
            className="fas fa-users"
            style={{ fontSize: "2rem", color: "#666", marginBottom: "10px" }}
          ></i>
          <p style={{ color: "#666", margin: "0" }}>
            Chưa có thông tin ban lãnh đạo
          </p>
        </div>
      );
    }

    return (
      <div className={style.boardMembersContainer}>
        {boardData.map((member, index) => (
          <div className={style.boardMemberItem} key={member.id || index}>
            <div className={style.memberInfo}>
              <h4 className={style.memberName}>{member.personName}</h4>
              <p className={style.memberPosition}>{member.position}</p>
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#666",
                opacity: 0.7,
                minWidth: "20px",
                textAlign: "right",
              }}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    );
  }, [boardMember.data]);

  const renderErrorContent = useCallback(() => {
    return (
      <section className={style.sectionCompanyOverview}>
        <ContentCard title="Lỗi tải dữ liệu" cardSize="large">
          <div className={style.errorContainer}>
            <i
              className="fas fa-exclamation-triangle fa-3x"
              style={{ color: "#FF6B6B", marginBottom: "20px" }}
            ></i>
            <h3 style={{ color: "#FF6B6B", margin: "10px 0" }}>
              Không thể tải dữ liệu công ty
            </h3>
            <p style={{ color: "#666", margin: "10px 0", textAlign: "center" }}>
              {errors.companyOverview || "Có lỗi xảy ra khi tải dữ liệu"}
            </p>
            <p
              style={{
                color: "#888",
                fontSize: "14px",
                margin: "20px 0 0 0",
                textAlign: "center",
              }}
            >
              Vui lòng kiểm tra lại mã chứng khoán và thử lại
            </p>
          </div>
        </ContentCard>
      </section>
    );
  }, [errors.companyOverview]);

  const periodText = typePeriod === "YEARLY" ? "năm" : "quý";

  return (
    <>
      <MainHeader
        title="Investment"
        subTitle="Đầu tư cho tương lai của chính bạn"
        isShowPeriod={false}
        isShowButton={false}
        onSubmitInput={onSubmitFindCode}
        placeholderInput="Tìm mã chứng khoán..."
        iconInput="fa-solid fa-magnifying-glass"
      />

      {errors.companyOverview && selectedSymbol ? (
        renderErrorContent()
      ) : (
        <>
          <section className={style.sectionCompanyName}>
            <h2>
              {companyOverview.data?.name || "Tên công ty"} (
              {companyOverview.data?.stockExchange?.name || "Sàn giao dịch"}:{" "}
              {companyOverview.data?.code || "Mã"})
            </h2>
            <p>{companyOverview.data?.industry?.name || "Ngành nghề"}</p>
          </section>

          <section className={style.sectionCompanyOverview}>
            <ContentCard title="Tổng quan công ty" cardSize="large">
              {isLoading.companyOverview ? (
                renderLoadingState("Đang tải thông tin công ty...")
              ) : (
                <p className={style.overviewText}>
                  {companyOverview.data?.overview ||
                    `Vui lòng tìm kiếm mã chứng khoán để xem thông tin tổng quan về công ty.`}
                </p>
              )}
            </ContentCard>

            <div className={style.cardRow}>
              <ContentCard title="Các chỉ số quan trọng" cardSize="small">
                {isLoading.indicatorValue
                  ? renderLoadingState("Đang tải chỉ số...")
                  : renderKeyIndicators()}
              </ContentCard>

              <ContentCard title="Góc nhìn FinFlow" cardSize="small">
                {isLoading.indicatorValue
                  ? renderLoadingState("Đang tải định giá...")
                  : renderFinFlowView()}
              </ContentCard>

              <ContentCard title="Top 10 cổ đông lớn" cardSize="small">
                {shareholderChartData.stats && (
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>
                      Cổ đông lớn nhất:{" "}
                      {shareholderChartData.stats.topShareholder}
                    </p>
                    {shareholderChartData.stats.unknownPercentage > 0 && (
                      <p
                        style={{
                          color: "#888",
                          fontSize: "11px",
                          margin: "2px 0",
                        }}
                      >
                        Cổ đông nhỏ lẻ khác:{" "}
                        {shareholderChartData.stats.unknownPercentage}%
                      </p>
                    )}
                  </div>
                )}
                {renderChart(
                  shareholderChartData,
                  "doughnut",
                  isLoading.stockShareholder,
                  "Đang tải dữ liệu cổ đông..."
                )}
              </ContentCard>
            </div>

            <div>
              <Button
                text="Quý"
                isLarge={false}
                isPrimary={typePeriod === "QUARTERLY"}
                onClick={() => handleClickPeriod("QUARTERLY")}
              />
              <Button
                text="Năm"
                isLarge={false}
                isPrimary={typePeriod === "YEARLY"}
                onClick={() => handleClickPeriod("YEARLY")}
              />
            </div>

            <div className={style.cardRow}>
              <ContentCard title="Cơ cấu tài sản" cardSize="small">
                {renderChart(
                  assetsStructureData,
                  "mixed",
                  isLoading.assetsReport,
                  "Đang tải dữ liệu tài sản..."
                )}
              </ContentCard>

              <ContentCard title="Cơ cấu nguồn vốn" cardSize="small">
                {renderChart(
                  capitalStructureData,
                  "mixed",
                  isLoading.liabilitiesAndEquity,
                  "Đang tải dữ liệu nguồn vốn..."
                )}
              </ContentCard>

              <ContentCard title="ROE & ROA" cardSize="small">
                {renderChart(
                  roeRoaData,
                  "line",
                  isLoading.indicatorValue,
                  "Đang tải ROE & ROA..."
                )}
              </ContentCard>

              <ContentCard
                title={`Doanh thu hàng ${periodText}: Tăng trưởng kép ${
                  hasValidData(revenueChartData) ? revenueChartData.cagr : "N/A"
                }%/${periodText} trong 5 ${periodText} qua`}
                cardSize="small"
              >
                {hasValidData(revenueChartData) && (
                  <p
                    style={{
                      color: getCagrOpinion(revenueChartData.cagr || 0).color,
                      textAlign: "center",
                    }}
                  >
                    {getCagrOpinion(revenueChartData.cagr || 0).text}
                  </p>
                )}
                {renderChart(
                  revenueChartData,
                  "mixed",
                  isLoading.incomeStatement,
                  "Đang tải dữ liệu doanh thu..."
                )}
              </ContentCard>

              <ContentCard
                title={`Lợi nhuận hàng ${periodText}: Tăng trưởng kép ${
                  hasValidData(profitChartData) ? profitChartData.cagr : "N/A"
                }%/${periodText} trong 5 ${periodText} qua`}
                cardSize="small"
              >
                {hasValidData(profitChartData) && (
                  <p
                    style={{
                      color: getCagrOpinion(profitChartData.cagr || 0).color,
                      textAlign: "center",
                    }}
                  >
                    {getCagrOpinion(profitChartData.cagr || 0).text}
                  </p>
                )}
                {renderChart(
                  profitChartData,
                  "mixed",
                  isLoading.incomeStatement,
                  "Đang tải dữ liệu lợi nhuận..."
                )}
              </ContentCard>

              {!isBankingSector && (
                <ContentCard title="Biên lợi nhuận" cardSize="small">
                  {renderChart(
                    profitMarginData,
                    "line",
                    isLoading.indicatorValue,
                    "Đang tải biên lợi nhuận..."
                  )}
                </ContentCard>
              )}

              {isBankingSector && (
                <ContentCard
                  title={`Cơ cấu TOI: Tăng trưởng kép ${
                    hasValidData(toiChartData) ? toiChartData.cagr : "N/A"
                  }%/${periodText}`}
                  cardSize="small"
                >
                  {renderChart(
                    toiChartData,
                    "mixed",
                    isLoading.incomeStatement,
                    "Đang tải dữ liệu TOI..."
                  )}
                </ContentCard>
              )}

              <ContentCard
                title={`Cổ tức hàng năm: Tăng trưởng kép ${
                  dividendChartData.stats?.cagr || "N/A"
                }%/năm trong 5 năm qua`}
                cardSize="small"
              >
                {dividendChartData.stats && (
                  <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <p
                      style={{
                        color: "#FFA500",
                        fontSize: "14px",
                        margin: "5px 0",
                      }}
                    >
                      <strong>
                        Tỷ lệ cổ tức trung bình: {dividendChartData.stats.yield}
                        %
                      </strong>
                    </p>
                    <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>
                      Cổ tức gần nhất:{" "}
                      {formatCurrency(dividendChartData.stats.latestDividend)} (
                      {dividendChartData.stats.latestYield.toFixed(2)}%)
                    </p>
                  </div>
                )}
                {renderChart(
                  dividendChartData,
                  "mixed",
                  isLoading.dividend,
                  "Đang tải dữ liệu cổ tức..."
                )}
              </ContentCard>

              <ContentCard title="Ban lãnh đạo" cardSize="medium">
                {isLoading.boardMember ? (
                  renderLoadingState("Đang tải thông tin ban lãnh đạo...")
                ) : (
                  <div className={style.boardMembersScrollContainer}>
                    {renderBoardMembers()}
                  </div>
                )}
              </ContentCard>
            </div>

            {selectedSymbol && (
              <Form onSubmit={handleDateRangeApply}>
                <div className={style.dateRangeContainer}>
                  <FormGroup
                    icon="fa-solid fa-calendar-days"
                    label="Chọn ngày bắt đầu"
                    type="date"
                    value={startDate}
                    setValue={setStartDate}
                  />
                  <FormGroup
                    icon="fa-solid fa-calendar-days"
                    label="Chọn ngày kết thúc"
                    type="date"
                    value={endDate}
                    setValue={setEndDate}
                  />
                  <SubmitButton isLarge={false} text="Lưu" />
                </div>
              </Form>
            )}

            {[
              { metric: "P/E", data: peData },
              { metric: "P/B", data: pbData },
              { metric: "P/S", data: psData },
            ].map(({ metric, data }) => (
              <ContentCard
                key={metric}
                title={`Định giá ${metric}: ${getComparisonText(
                  data.current,
                  data.median,
                  data.comparison
                )}`}
                cardSize="large"
              >
                {renderChart(
                  data,
                  "line",
                  isLoading.indicatorValue,
                  `Đang tải dữ liệu ${metric}...`
                )}
              </ContentCard>
            ))}
          </section>
        </>
      )}
    </>
  );
};

export default InvestmentPage;
