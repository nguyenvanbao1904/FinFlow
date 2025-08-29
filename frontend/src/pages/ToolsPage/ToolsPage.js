import { useState } from "react";
import MainHeader from "../../components/Header/MainHeader";
import ToolCard from "../../components/ToolCard/ToolCard";
import style from "./toolsPage.module.css";
import SavingGoalCalculator from "../../components/ToolsSection/SavingGoalCalculator";
import CompoundInterestCalculator from "../../components/ToolsSection/CompoundInterestCalculator";
const ToolsPage = () => {
  const [activeTool, setActiveTool] = useState(null);

  const handleToolClick = (toolId) => {
    setActiveTool(toolId);
  };

  const tools = [
    {
      id: "SavingGoalCalculator",
      title: "Tiết kiệm Mục tiêu",
      description:
        "Tính toán số tiền cần tiết kiệm hàng tháng để đạt được mục tiêu tài chính trong thời gian nhất định.",
      features: [
        "Tính toán tiết kiệm hàng tháng",
        "Tính lãi suất kép",
        "Điều chỉnh thời gian linh hoạt",
      ],
      icon: "fa-solid fa-piggy-bank",
      isAvailable: true,
    },
    {
      id: "CompoundInterestCalculator",
      title: "Máy tính Lãi Kép",
      description:
        "Xem tài sản của bạn tăng trưởng như thế nào theo thời gian với sức mạnh của lãi suất kép.",
      features: [
        "Tính lãi suất kép chính xác",
        "Gửi tiền định kỳ",
        "Biểu đồ tăng trưởng",
      ],
      icon: "fa-solid fa-chart-line",
      isAvailable: true,
    },
    {
      id: "MortgageCalculator",
      title: "Máy tính Vay mua Nhà",
      description:
        "Tính toán khoản vay thế chấp, lãi suất và số tiền trả hàng tháng cho việc mua nhà.",
      features: [
        "Tính toán trả góp",
        "Lãi suất thế chấp",
        "Biểu đồ thanh toán",
      ],
      icon: "fa-solid fa-home",
      isAvailable: false,
    },
    {
      id: "RetirementCalculator",
      title: "Máy tính Thuế",
      description:
        " Tính toán thuế thu nhập cá nhân và lập kế hoạch tối ưu hóa thuế.",
      features: [
        "Thuế thu nhập cá nhân",
        "Giảm trừ gia cảnh",
        "Tối ưu hóa thuế",
      ],
      icon: "fa-solid fa-receipt",
      isAvailable: false,
    },
    {
      id: "LoanCalculator",
      title: "Tính lương ( Gross - Net )",
      description: " Tính toán lương từ Gross sang Net và ngược lại.",
      features: ["Tính lương Gross", "Tính lương Net", "So sánh lương"],
      icon: "fa-solid fa-money-bill",
      isAvailable: false,
    },
  ];

  const getActiveToolInfo = () => {
    const activeToolData = tools.find((tool) => tool.id === activeTool);
    if (!activeToolData) {
      return {
        title: "Chọn một công cụ để bắt đầu",
        description:
          "Hãy chọn một trong các công cụ tài chính phía trên để bắt đầu tính toán và lập kế hoạch cho tương lai của bạn.",
        icon: "fa-solid fa-calculator", // Icon mặc định
      };
    }

    return {
      title: activeToolData.title,
      description: activeToolData.description,
      icon: activeToolData.icon, // Icon của tool được chọn
    };
  };

  return (
    <>
      <MainHeader
        title="Công cụ Hoạch định"
        subTitle="Bộ công cụ tài chính thông minh để lập kế hoạch tương lai"
        isShowButton={false}
        isShowPeriod={false}
      />
      <section className={style.toolsContent}>
        <h2>Chọn công cụ phù hợp</h2>
        <p>Tính toán và lập kế hoạch tài chính với các công cụ chuyên nghiệp</p>
      </section>
      <div className={style.toolsGrid}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onClick={handleToolClick}
            isActive={activeTool === tool.id}
          />
        ))}
      </div>
      <section className={style.activeToolSection}>
        <div className={style.activeToolHeader}>
          <h4>
            <i className={getActiveToolInfo().icon}></i>
            {getActiveToolInfo().title}
          </h4>
          <p>{getActiveToolInfo().description}</p>
        </div>
        <div className={style.toolContent}>
          {activeTool == null ? (
            <>
              <div className={style.welcomeState}>
                <div className={style.welcomeIcon}>
                  <i className="fa-solid fa-rocket"></i>
                </div>
                <h3>Bắt đầu hành trình tài chính</h3>
                <p>
                  Sử dụng các công cụ tính toán chuyên nghiệp để lập kế hoạch
                  tài chính thông minh và đạt được mục tiêu của bạn.
                </p>
              </div>
            </>
          ) : (
            <>
              {activeTool === "SavingGoalCalculator" && (
                <SavingGoalCalculator />
              )}
              {activeTool === "CompoundInterestCalculator" && (
                <CompoundInterestCalculator />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ToolsPage;
