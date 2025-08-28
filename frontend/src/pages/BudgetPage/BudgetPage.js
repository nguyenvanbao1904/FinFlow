import { useCallback, useEffect, useState } from "react";
import MainHeader from "../../components/Header/MainHeader";
import style from "../DashBoardPage/dashBoardPage.module.css";
import budgetPageStyle from "./budgetPage.module.css";
import { setPeriod } from "../../redux/features/budget/budgetSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBudgets,
  selectBudgetSummary,
  selectPeriod,
} from "../../redux/features/budget/budgetSelections";
import AddBudgetModal from "../../components/Modal/AddBudgetModal";
import { fetchBudgets } from "../../redux/features/budget/budgetThunks";
import BudgetCard from "../../components/BudgetCard/BudgetCard";
import StatCard from "../../components/StatCard/StatCard";
import formatCurrency from "../../utils/formatCurrency";
import useApi from "../../hooks/useApi";
import { endpoints } from "../../configs/apis";
import { toast } from "react-toastify";

const BudgetPage = () => {
  const budgets = useSelector(selectBudgets);
  const summary = useSelector(selectBudgetSummary);
  const [openAddBudgetModal, setOpenAddBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const { callApi: callDeleteApi } = useApi();

  const dispatch = useDispatch();
  const period = useSelector(selectPeriod);

  const summaryDisplayConfig = [
    {
      key: "totalBudgetLimit",
      title: "Tổng ngân sách",
      type: "balance",
      icon: "fa-solid fa-wallet",
    },
    {
      key: "totalAmountSpent",
      title: "Đã chi tiêu",
      type: "expense",
      icon: "fa-solid fa-arrow-down",
    },
    {
      key: "totalRemainingAmount",
      title: "Còn lại",
      type: "saving",
      icon: "fa-solid fa-piggy-bank",
    },
  ];

  const handleChangePeriod = useCallback(
    (startDate, endDate, type) => {
      if (
        !(
          period.type === type &&
          period.startDate === startDate &&
          period.endDate === endDate
        )
      ) {
        dispatch(
          setPeriod({
            type: type,
            startDate: startDate,
            endDate: endDate,
          })
        );
      }
    },
    [dispatch, period]
  );

  useEffect(() => {
    dispatch(fetchBudgets({ period, page: 1 }));
  }, [dispatch, period]);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setOpenAddBudgetModal(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setOpenAddBudgetModal(true);
  };

  const handleDeleteBudget = async (budgetId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ngân sách này không?")) {
      try {
        await callDeleteApi(
          "DELETE",
          endpoints.budgets.delete + `/${budgetId}`
        );

        dispatch(fetchBudgets({ period, page: 1 }));

        toast.success("Xóa ngân sách thành công!", {
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error deleting budget:", error);
        toast.error("Đã có lỗi xảy ra khi xóa ngân sách.", { autoClose: 2000 });
      }
    }
  };

  const handleCloseModal = () => {
    setOpenAddBudgetModal(false);
    setEditingBudget(null);
  };

  return (
    <>
      <MainHeader
        title="Budget"
        subTitle="Quản lý ngân sách"
        onChangePeriod={handleChangePeriod}
        buttonText="Thêm ngân sách"
        buttonIcon="fa-solid fa-plus"
        onClickButton={handleAddBudget}
      />
      <section className={style.overviewSection}>
        {budgets.statusLoading === "loading" ? (
          <div>
            <h3>Loading thống kê...</h3>
          </div>
        ) : (
          <div className={style.overviewCards}>
            {summaryDisplayConfig.map((config, index) => (
              <StatCard
                key={index}
                type={config.type}
                content={{
                  title: config.title,
                  value: `${formatCurrency(summary[config.key] || 0)}`,
                  period:
                    period.type === "WEEK"
                      ? "Tuần"
                      : period.type === "MONTH"
                      ? "Tháng"
                      : "Năm",
                }}
              />
            ))}
          </div>
        )}
      </section>
      <section className={style.transactionsSection}>
        {budgets.statusLoading === "loading" ? (
          <div>
            <h3>Loading danh sách ngân sách...</h3>
          </div>
        ) : (
          <div className={style.transactionCards}>
            <h3>Ngân sách theo danh mục</h3>
            <div className={budgetPageStyle.overviewCards}>
              {budgets.budgetResponses.map((budget) => (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  onEdit={handleEditBudget}
                  onDelete={handleDeleteBudget}
                />
              ))}
              <div
                className={`${budgetPageStyle.budgetCard} ${budgetPageStyle.addNewCard}`}
                onClick={handleAddBudget}
              >
                <div className={budgetPageStyle.addNewContent}>
                  <div className={budgetPageStyle.addIcon}>
                    <i className="fa-solid fa-plus"></i>
                  </div>
                  <h4>Tạo ngân sách mới</h4>
                  <p>Thêm danh mục để kiểm soát chi tiêu</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <AddBudgetModal
        openModal={openAddBudgetModal}
        closeModalHandler={handleCloseModal}
        budget={editingBudget}
      />
    </>
  );
};

export default BudgetPage;
