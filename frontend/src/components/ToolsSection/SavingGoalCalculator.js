import style from "./toolsSection.module.css";
import Form from "../../components/Form/Form";
import FormGroup from "../../components/Form/FormGroup";
import Button from "../Button/Button";
import SubmitButton from "../Button/SubmitButton";
import CustomChart from "../Chart/CustomChart";
import { useState } from "react";
import { formatSimpleCurrency } from "../../utils/formatters";

const SavingGoalCalculator = () => {
  const [moneyGoal, setMoneyGoal] = useState();
  const [timeYears, setTimeYears] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [moneyInitial, setMoneyInitial] = useState();
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [chartData, setChartData] = useState(null);

  const handleClearForm = () => {
    setMoneyGoal("");
    setTimeYears(0);
    setInterestRate(0);
    setMoneyInitial("");
    setMonthlyPayment(0);
    setChartData(null);
  };

  const handleMoneyGoalChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setMoneyGoal(numericValue);
  };

  const handleMoneyInitialChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setMoneyInitial(numericValue);
  };

  const calculateChartData = (goal, initial, payment, years, monthlyRate) => {
    const labels = [];
    const initialInvestment = [];
    const monthlySavings = [];
    const totalSavings = [];

    for (let year = 0; year <= years; year++) {
      labels.push(`Năm ${year}`);

      const months = year * 12;

      // Tổng vốn đầu tư ban đầu sau lãi kép
      const initialValue = initial * Math.pow(1 + monthlyRate, months);
      initialInvestment.push(initialValue);

      // Tổng tiền tiết kiệm hàng tháng sau lãi kép
      let savingsValue = 0;
      if (monthlyRate === 0) {
        savingsValue = payment * months;
      } else {
        savingsValue =
          payment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      }
      monthlySavings.push(savingsValue);

      // Tổng tài sản
      totalSavings.push(initialValue + savingsValue);
    }

    return {
      labels,
      datasets: [
        {
          label: "Tổng vốn đầu tư ban đầu (VND)",
          data: initialInvestment,
          borderColor: "#10b981", // Màu xanh lá
          backgroundColor: "#10b981",
          fill: false,
          tension: 0.4,
          borderWidth: 1,
          pointRadius: 2,
        },
        {
          label: "Tổng tiết kiệm cộng lãi (VND)",
          data: monthlySavings,
          borderColor: "#3b82f6", // Màu xanh dương
          backgroundColor: "#3b82f6",
          fill: false,
          tension: 0.4,
          borderWidth: 1,
          pointRadius: 2,
        },
        {
          label: "Tổng tiền bổ sung (VND)",
          data: totalSavings,
          borderColor: "#8b5cf6",
          backgroundColor: "#8b5cf6",
          fill: false,
          tension: 0.4,
          borderWidth: 1, // Làm đường mỏng hơn
          pointRadius: 2, // Làm điểm nhỏ hơn
        },
      ],
    };
  };

  const calculate = (e) => {
    e.preventDefault();

    // Validate input
    if (!moneyGoal || timeYears <= 0 || interestRate < 0) {
      console.log("Vui lòng nhập đầy đủ thông tin hợp lệ");
      return;
    }

    const A = parseFloat(moneyGoal); // Số tiền mục tiêu
    const P = parseFloat(moneyInitial) || 0; // Khoản tiền đầu tư ban đầu
    const r = parseFloat(interestRate) / 100; // Lãi suất hàng năm
    const t = parseFloat(timeYears); // Thời gian (năm)
    const n = 12; // Số kỳ hạn nhận lãi trong năm (tháng)

    let Q; // Số tiền cần tiết kiệm mỗi tháng

    if (r === 0) {
      // Không có lãi suất
      Q = (A - P) / (n * t);
    } else {
      // Áp dụng công thức: Q = (A - P × (1 + r/n)^(n×t)) × (r/12) / ((1 + r/n)^(n×t) - 1)
      const monthlyRate = r / n; // r/n
      const totalPeriods = n * t; // n×t
      const futureValueOfInitial = P * Math.pow(1 + monthlyRate, totalPeriods); // P × (1 + r/n)^(n×t)
      const remainingAmount = A - futureValueOfInitial; // A - P × (1 + r/n)^(n×t)

      if (remainingAmount <= 0) {
        Q = 0; // Số tiền ban đầu đã đủ
      } else {
        Q =
          (remainingAmount * (r / 12)) /
          (Math.pow(1 + monthlyRate, totalPeriods) - 1);
      }
    }

    setMonthlyPayment(Math.max(0, Q));

    // Generate chart data - chỉ tạo chart khi Q > 0 hoặc luôn hiển thị để thấy sự tăng trưởng
    const chartDataResult = calculateChartData(A, P, Math.max(0, Q), t, r / 12);
    setChartData(chartDataResult);

    console.log("Số tiền cần tiết kiệm mỗi tháng:", Q);
    console.log("Future value of initial:", P * Math.pow(1 + r / 12, n * t));
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

  return (
    <div className={style.toolCard}>
      <div className={style.toolCardBody}>
        <div className={style.toolInputColumn}>
          <Form onSubmit={calculate}>
            <FormGroup
              label="Số tiền mục tiêu"
              placeholder="100,000,000 VND"
              icon="fa-solid fa-bullseye"
              type="text"
              value={
                moneyGoal
                  ? formatSimpleCurrency(moneyGoal).replace(/\s₫/g, "")
                  : ""
              }
              setValue={handleMoneyGoalChange}
            />
            <FormGroup
              label="Thời gian đạt được (năm)"
              placeholder="5"
              icon="fa-solid fa-calendar"
              type="number"
              value={timeYears}
              setValue={setTimeYears}
            />
            <FormGroup
              label="Lãi suất dự kiến (%/năm)"
              placeholder="20"
              icon="fa-solid fa-arrow-trend-up"
              type="number"
              value={interestRate}
              setValue={setInterestRate}
            />
            <FormGroup
              label="Số tiền ban đầu"
              placeholder="0"
              icon="fa-solid fa-money-bill"
              type="text"
              value={
                moneyInitial
                  ? formatSimpleCurrency(moneyInitial).replace(/\s₫/g, "")
                  : ""
              }
              setValue={handleMoneyInitialChange}
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
            <i className="fa-solid fa-calendar-check"></i> Mỗi tháng cần tiết
            kiệm
          </h5>
          <div className={style.mainResult}>
            {monthlyPayment === 0
              ? "0₫"
              : formatSimpleCurrency(monthlyPayment.toFixed(0))}
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
            {monthlyPayment === 0 && moneyInitial && (
              <>
                <br />
                <em style={{ color: "#10b981" }}>
                  Số tiền ban đầu đã đủ để đạt mục tiêu!
                </em>
              </>
            )}
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

export default SavingGoalCalculator;
