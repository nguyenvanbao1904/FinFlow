import ActionButton from "../../components/Button/ActionButton";
import ChartCard from "../../components/ChartCard/ChartCard";
import ContentCard from "../../components/ContentCard/ContentCard";
import GoalItem from "../../components/GoalItem/GoalItem";
import MainHeader from "../../components/Header/MainHeader";
import StatCard from "../../components/StatCard/StatCard";
import TransactionCard from "../../components/TransactionCard/TransactionCard";
import MainLayout from "../../layout/MainLayout/MainLayout";
import style from "./dashBoardPage.module.css";

const DashboardPage = () => {
  const goal1 = {
    name: "Mua laptop mới",
    currentAmount: 32500000,
    targetAmount: 50000000,
  };
  const goal2 = {
    name: "Du lịch Đà Lạt",
    currentAmount: 8000000,
    targetAmount: 20000000,
  };
  return (
    <MainLayout>
      <MainHeader />
      <section className={style.overviewSection}>
        <div className={style.overviewCards}>
          <StatCard
            type="income"
            isPositive={true}
            content={{
              title: "Thu nhập",
              period: "Tháng này",
              value: "25.000.000₫",
              percentage: "12.5",
            }}
            icon="fa-solid fa-arrow-up"
          />
          <StatCard
            type="expense"
            isPositive={false}
            content={{
              title: "Chi tiêu",
              period: "Tháng này",
              value: "10.000.000₫",
              percentage: "-5",
            }}
            icon="fa-solid fa-arrow-down"
          />
          <StatCard
            type="balance"
            isPositive={true}
            content={{
              title: "Số dư",
              period: "Tháng này",
              value: "15.000.000₫",
              percentage: "7.5",
            }}
            icon="fa-solid fa-wallet"
          />
          <StatCard
            type="savings"
            isPositive={true}
            content={{
              title: "Tiết kiệm",
              period: "Tháng này",
              value: "5.000.000₫",
              percentage: "10",
            }}
            icon="fa-solid fa-piggy-bank"
          />
        </div>
      </section>
      <section className={style.chartsSection}>
        <div className={style.chartGrid}>
          <ChartCard
            title="Dòng tiền theo thời gian"
            legends={[
              { title: "Thu nhập", color: "#10b981" },
              { title: "Chi tiêu", color: "#ef4444" },
            ]}
          ></ChartCard>
          <ChartCard
            title="Cơ cấu chi tiêu"
            legends={[
              { title: "Ăn uống", color: "#10b981" },
              { title: "Mua sắm", color: "#4dabf7" },
              { title: "Di chuyển", color: "#fcc419" },
            ]}
          ></ChartCard>
        </div>
      </section>
      <section className={style.contentGrid}>
        <ContentCard
          title="Giao dịch gần đây"
          iconButton="fa-solid fa-arrow-right"
          titleButton="Xem tất cả"
          onclick={() => {
            console.log(1);
          }}
        >
          <TransactionCard
            amount="-350000"
            color="#ff6b6b"
            date="Hôm nay, 12:30"
            description="Bữa trưa cùng đồng nghiệp"
            title="Ăn uống"
            type="expense"
            icon="fa-solid fa-utensils"
          />
          <TransactionCard
            amount="20000000"
            color="#51cf66"
            date="25/10/2024"
            description="Lương tháng 10"
            title="Lương"
            type="income"
            icon="fa-solid fa-money-bill-wave"
          />
        </ContentCard>
        <ContentCard title="Hành động nhanh">
          <div className={style.quickActions}>
            <ActionButton text="Thu nhập" icon="fa-solid fa-plus" />
            <ActionButton text="Chi tiêu" icon="fa-solid fa-minus" />
            <ActionButton
              text="Chuyển tiền"
              icon="fa-solid fa-money-bill-transfer"
            />
            <ActionButton text="Mục tiêu mới" icon="fa-solid fa-bullseye" />
          </div>
          <div className={style.goalsSection}>
            <h4>Mục tiêu tiết kiệm</h4>
            <GoalItem goal={goal1} />
            <GoalItem goal={goal2} />
          </div>
        </ContentCard>
      </section>
    </MainLayout>
  );
};

export default DashboardPage;
