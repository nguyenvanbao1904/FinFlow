import style from "./toolsSection.module.css";
import Form from "../../components/Form/Form";
import FormGroup from "../../components/Form/FormGroup";
import Button from "../Button/Button";
import SubmitButton from "../Button/SubmitButton";
import CustomChart from "../Chart/CustomChart";
import { useState } from "react";
import { formatSimpleCurrency } from "../../utils/formatters";

const CompoundInterestCalculator = () => {
  const [initialAmount, setInitialAmount] = useState();
  const [monthlyContribution, setMonthlyContribution] = useState();
  const [timeYears, setTimeYears] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [chartData, setChartData] = useState(null);

  const handleClearForm = () => {
    setInitialAmount("");
    setMonthlyContribution("");
    setTimeYears(0);
    setInterestRate(0);
    setFinalAmount(0);
    setChartData(null);
  };

  const handleInitialAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setInitialAmount(numericValue);
  };

  const handleMonthlyContributionChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setMonthlyContribution(numericValue);
  };

  const calculateChartData = (initial, monthly, years, monthlyRate) => {
    const labels = [];
    const principalData = []; // Tổng tiền gốc (không có lãi)
    const totalValueData = []; // Tổng giá trị (có lãi)

    for (let year = 0; year <= years; year++) {
      labels.push(`Năm ${year}`);

      const months = year * 12;

      // 1. Tổng tiền gốc = Vốn ban đầu + (Tiền gộp hàng tháng × số tháng)
      const totalPrincipal = initial + monthly * months;
      principalData.push(totalPrincipal);

      // 2. Tổng giá trị (có lãi) = Vốn ban đầu sau lãi kép + Tiền gộp hàng tháng sau lãi kép
      const initialValueWithInterest =
        initial * Math.pow(1 + monthlyRate, months);

      let monthlyContributionsWithInterest = 0;
      if (monthlyRate === 0) {
        monthlyContributionsWithInterest = monthly * months;
      } else {
        monthlyContributionsWithInterest =
          monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      }

      const totalValue =
        initialValueWithInterest + monthlyContributionsWithInterest;
      totalValueData.push(totalValue);
    }

    return {
      labels,
      datasets: [
        {
          label: "Tổng tiền gốc (VND)",
          data: principalData,
          borderColor: "#10b981", // Màu xanh lá
          backgroundColor: "#10b981",
          fill: false,
          tension: 0.4,
          borderWidth: 1,
          pointRadius: 2,
        },
        {
          label: "Tổng giá trị (có lãi) (VND)",
          data: totalValueData,
          borderColor: "#3b82f6", // Màu xanh dương
          backgroundColor: "#3b82f6",
          fill: false,
          tension: 0.4,
          borderWidth: 1,
          pointRadius: 2,
        },
      ],
    };
  };

  const calculate = (e) => {
    e.preventDefault();

    // Validate input
    if (
      (!initialAmount && !monthlyContribution) ||
      timeYears <= 0 ||
      interestRate < 0
    ) {
      console.log("Vui lòng nhập đầy đủ thông tin hợp lệ");
      return;
    }

    const P = parseFloat(initialAmount) || 0; // Số tiền ban đầu
    const PMT = parseFloat(monthlyContribution) || 0; // Tiết kiệm mỗi tháng
    const r = parseFloat(interestRate) / 100; // Lãi suất hàng năm
    const t = parseFloat(timeYears); // Thời gian (năm)
    const n = 12; // Số kỳ hạn nhận lãi trong năm (tháng)

    let A; // Tổng số tiền cuối kỳ

    if (r === 0) {
      // Không có lãi suất
      A = P + PMT * n * t;
    } else {
      // Công thức lãi kép: A = P × (1 + r/n)^(n×t) + PMT × [((1 + r/n)^(n×t) - 1) / (r/n)]
      const monthlyRate = r / n; // r/n
      const totalPeriods = n * t; // n×t

      // Giá trị tương lai của vốn ban đầu
      const futureValueOfPrincipal =
        P * Math.pow(1 + monthlyRate, totalPeriods);

      // Giá trị tương lai của dòng tiền hàng tháng
      const futureValueOfAnnuity =
        PMT * ((Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate);

      A = futureValueOfPrincipal + futureValueOfAnnuity;
    }

    setFinalAmount(A);

    // Generate chart data
    const chartDataResult = calculateChartData(P, PMT, t, r / 12);
    setChartData(chartDataResult);

    console.log("Tổng số tiền cuối kỳ:", A);
    console.log("Lãi kiếm được:", A - P - PMT * n * t);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#A0AEC0",
          usePointStyle: true,
          pointStyle: "line",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${formatSimpleCurrency(
              context.parsed.y
            )}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatSimpleCurrency(value);
          },
          color: "#A0AEC0",
        },
        grid: {
          color: "#2D3748",
        },
      },
      x: {
        ticks: {
          color: "#A0AEC0",
        },
        grid: {
          color: "#2D3748",
        },
      },
    },
  };

  // Tính toán các thông tin bổ sung
  const totalContributed =
    (parseFloat(initialAmount) || 0) +
    (parseFloat(monthlyContribution) || 0) * timeYears * 12;
  const totalInterest = finalAmount - totalContributed;

  return (
    <div className={style.toolCard}>
      <div className={style.toolCardBody}>
        <div className={style.toolInputColumn}>
          <Form onSubmit={calculate}>
            <FormGroup
              label="Số tiền ban đầu"
              placeholder="100,000,000 VND"
              icon="fa-solid fa-money-bill"
              type="text"
              value={
                initialAmount
                  ? formatSimpleCurrency(initialAmount).replace(/\s₫/g, "")
                  : ""
              }
              setValue={handleInitialAmountChange}
            />
            <FormGroup
              label="Tiết kiệm thêm mỗi tháng"
              placeholder="5,000,000 VND"
              icon="fa-solid fa-piggy-bank"
              type="text"
              value={
                monthlyContribution
                  ? formatSimpleCurrency(monthlyContribution).replace(
                      /\s₫/g,
                      ""
                    )
                  : ""
              }
              setValue={handleMonthlyContributionChange}
            />
            <FormGroup
              label="Thời gian đầu tư (năm)"
              placeholder="10"
              icon="fa-solid fa-calendar"
              type="number"
              value={timeYears}
              setValue={setTimeYears}
            />
            <FormGroup
              label="Lãi suất dự kiến (%/năm)"
              placeholder="12"
              icon="fa-solid fa-arrow-trend-up"
              type="number"
              value={interestRate}
              setValue={setInterestRate}
            />
            <div className={style.modalActions}>
              <Button
                isLarge={false}
                onClick={handleClearForm}
                text="Xóa"
                isPrimary={false}
              />
              <SubmitButton isLarge={false} text="Tính toán" />
            </div>
          </Form>
        </div>
        <div className={style.toolResultColumn}>
          <h5>
            <i className="fa-solid fa-chart-line"></i> Tổng tài sản cuối kỳ
          </h5>
          <div className={style.mainResult}>
            {finalAmount === 0
              ? "0₫"
              : formatSimpleCurrency(finalAmount.toFixed(0))}
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              marginTop: "1rem",
              lineHeight: "1.4",
            }}
          >
            Với lãi suất <strong>{interestRate}%</strong>/năm trong{" "}
            <strong>{timeYears}</strong> năm
            <br />
            <span style={{ color: "#3b82f6" }}>
              Lãi kiếm được:{" "}
              <strong>{formatSimpleCurrency(totalInterest.toFixed(0))}</strong>
            </span>
            <br />
            <span style={{ color: "#10b981" }}>
              Tổng đóng góp:{" "}
              <strong>
                {formatSimpleCurrency(totalContributed.toFixed(0))}
              </strong>
            </span>
          </p>

          {/* Chart Section */}
          {chartData && (
            <div style={{ marginTop: "2rem", height: "400px", width: "100%" }}>
              <CustomChart
                data={chartData}
                options={chartOptions}
                type="line"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
