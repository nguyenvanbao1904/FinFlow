import ContentCard from "../../components/ContentCard/ContentCard";
import MainHeader from "../../components/Header/MainHeader";
import StatCard from "../../components/StatCard/StatCard";
import TransactionCard from "../../components/TransactionCard/TransactionCard";
import style from "./dashBoardPage.module.css";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCategoryExpenseDistribution,
  selectCategoryIncomeDistribution,
  selectPeriod,
  selectTransactions,
  selectSummary,
} from "../../redux/features/transaction/transactionSelectors";
import {
  fetchTransactions,
  fetchSummary,
  fetchCategoryDistribution,
} from "../../redux/features/transaction/transactionThunks";
import { selectUser } from "../../redux/features/auth/authSelectors";
import formatCurrency from "../../utils/formatCurrency";
import CustomChart from "../../components/Chart/CustomChart";
import useApi from "../../hooks/useApi";
import { endpoints } from "../../configs/apis";
import AddTransactionModal from "../../components/Modal/AddTransactionModal";
import CreatePasswordModal from "../../components/Modal/CreatePasswordModal";

const DashboardPage = () => {
  const transactions = useSelector(selectTransactions);
  const period = useSelector(selectPeriod);
  const summary = useSelector(selectSummary);
  const [openCreatePasswordModal, setOpenCreatePasswordModal] = useState(false);
  const categoryExpenseDistribution = useSelector(
    selectCategoryExpenseDistribution
  );
  const categoryIncomeDistribution = useSelector(
    selectCategoryIncomeDistribution
  );
  const statusLoading = {
    transactions: transactions.statusLoading,
    summary: summary.statusLoading,
    categoryExpense: categoryExpenseDistribution.statusLoading,
    categoryIncome: categoryIncomeDistribution.statusLoading,
  };
  const { callApi: callDeleteApi } = useApi();
  const { callApi: fetchTransactionApi } = useApi();

  const dispatch = useDispatch();
  const [chartData, setChartData] = useState({
    summaryTransactions: {},
    categoryExpenseDistribution: {},
    categoryIncomeDistribution: {},
  });
  const [transactionPage, setTransactionPage] = useState(1);

  const getTransactions = useCallback(
    async (page = 1) => {
      dispatch(fetchTransactions({ period, page }));
    },
    [dispatch, period]
  );

  // State cho modal
  const [openModalEditTransaction, setOpenModalEditTransaction] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const refreshDashboardData = useCallback(async () => {
    setTransactionPage(1);
    await Promise.all([
      dispatch(fetchSummary({ period })),
      dispatch(fetchTransactions({ period, page: 1 })),
      dispatch(fetchCategoryDistribution({ period, type: "EXPENSE" })),
      dispatch(fetchCategoryDistribution({ period, type: "INCOME" })),
    ]);
  }, [dispatch, period]);
  const user = useSelector(selectUser);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  useEffect(() => {
    if (transactionPage > 1 && transactionPage <= transactions.totalPages) {
      getTransactions(transactionPage);
    }
  }, [getTransactions, transactionPage, transactions.totalPages]);

  useEffect(() => {
    const timeSeriesData = summary.timeSeriesData || [];

    setChartData((prev) => ({
      ...prev,
      summaryTransactions: {
        labels: timeSeriesData.map((item) => item.period),
        datasets: [
          {
            label: "Thu nhập",
            data: timeSeriesData.map((item) => item.income),
            borderColor: "#2EC4B6",
            backgroundColor: "rgba(46, 196, 182, 0.2)",
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: "Chi tiêu",
            data: timeSeriesData.map((item) => item.expense),
            borderColor: "#E71D36",
            backgroundColor: "rgba(231, 29, 54, 0.2)",
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: "Tiết kiệm",
            data: timeSeriesData.map((item) => item.saving),
            borderColor: "#ec0fecff",
            backgroundColor: "rgba(236, 15, 236, 0.2)",
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
    }));
  }, [summary]);

  useEffect(() => {
    const expenseData = categoryExpenseDistribution.data || [];

    setChartData((prev) => ({
      ...prev,
      categoryExpenseDistribution: {
        labels: expenseData.map((item) => item.category_name),
        datasets: [
          {
            data: expenseData.map((item) => item.amount),
            backgroundColor: [
              "#ef4444",
              "#f97316",
              "#eab308",
              "#fb7185",
              "#f59e0b",
            ],
            borderWidth: 2,
            borderColor: "#0f172a",
            hoverOffset: 15,
          },
        ],
      },
    }));
  }, [categoryExpenseDistribution]);

  useEffect(() => {
    const incomeData = categoryIncomeDistribution.data || [];

    setChartData((prev) => ({
      ...prev,
      categoryIncomeDistribution: {
        labels: incomeData.map((item) => item.category_name),
        datasets: [
          {
            data: incomeData.map((item) => item.amount),
            backgroundColor: [
              "#10b981",
              "#4dabf7",
              "#fcc419",
              "#ef4444",
              "#a855f7",
            ],
            borderWidth: 2,
            borderColor: "#0f172a",
            hoverOffset: 15,
          },
        ],
      },
    }));
  }, [categoryIncomeDistribution]);

  // Handler cho edit transaction
  const handleEditTransaction = async (transactionId) => {
    try {
      const response = await fetchTransactionApi(
        "GET",
        `${endpoints.transactions.get}/${transactionId}`
      );
      setSelectedTransaction(response.data);
      setOpenModalEditTransaction(true);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      alert("Có lỗi xảy ra khi tải thông tin giao dịch");
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) {
      try {
        await callDeleteApi(
          "DELETE",
          endpoints.transactions.delete + `/${transactionId}`
        );
        await refreshDashboardData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Có lỗi xảy ra khi xóa giao dịch");
      }
    }
  };

  const handleCloseEditModal = () => {
    setOpenModalEditTransaction(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    if (user.noPassword) {
      setOpenCreatePasswordModal(true);
    }
  }, [user]);

  return (
    <>
      <MainHeader />
      <section className={style.overviewSection}>
        {statusLoading.summary === "loading" ? (
          <div>
            <h3>Loading thống kê...</h3>
          </div>
        ) : (
          <div className={style.overviewCards}>
            {/* SỬA LỖI Ở ĐÂY */}
            {Object.entries(summary.totalSummary || {}).map(
              ([key, item], index) => (
                <StatCard
                  key={index}
                  type={key}
                  content={{
                    title: key,
                    period: period.type,
                    value: `${formatCurrency(item)}`,
                  }}
                />
              )
            )}
          </div>
        )}
      </section>
      <section className={style.chartsSection}>
        <div className={style.chartGrid}>
          <ContentCard title="Dòng tiền theo thời gian">
            {statusLoading.summary === "loading" ? (
              <p>Đang tải biểu đồ...</p>
            ) : (
              <div className={style.chartBody}>
                <CustomChart type="line" data={chartData.summaryTransactions} />
              </div>
            )}
          </ContentCard>
          <ContentCard title="Cơ cấu chi tiêu">
            {statusLoading.categoryExpense === "loading" ? (
              <p>Đang tải biểu đồ chi tiêu...</p>
            ) : (
              <div className={style.chartBody}>
                <CustomChart
                  type="doughnut"
                  data={chartData.categoryExpenseDistribution}
                />
              </div>
            )}
          </ContentCard>
        </div>
      </section>
      <section className={style.contentGrid}>
        <ContentCard
          title="Giao dịch gần đây"
          onScrollEnd={() => setTransactionPage((prev) => prev + 1)}
          isLoading={statusLoading.transactions === "loading"}
        >
          {(transactions.transactionResponses || []).length === 0 ? (
            <p>Không có giao dịch nào</p>
          ) : (
            (transactions.transactionResponses || []).map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transactionId={transaction.id}
                amount={`${transaction.amount}`}
                color={transaction.category.colorCode}
                date={transaction.date}
                description={transaction.description}
                title={transaction.category.name}
                type={transaction.category.type.toLowerCase()}
                icon={transaction.category.icon.iconClass}
                showActions={true}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            ))
          )}
        </ContentCard>
        <ContentCard title="Cơ cấu thu nhập">
          {statusLoading.categoryIncome === "loading" ? (
            <p>Đang tải biểu đồ thu nhập...</p>
          ) : (
            <div className={style.chartBody}>
              <CustomChart
                type="doughnut"
                data={chartData.categoryIncomeDistribution}
              />
            </div>
          )}
        </ContentCard>
      </section>
      <AddTransactionModal
        openModal={openModalEditTransaction}
        closeModalHandler={handleCloseEditModal}
        transaction={selectedTransaction}
      />
      <CreatePasswordModal
        openModal={openCreatePasswordModal}
        closeModalHandler={() => setOpenCreatePasswordModal(false)}
      />
    </>
  );
};

export default DashboardPage;
