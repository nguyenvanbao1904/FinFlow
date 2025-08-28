import style from "./budgetCard.module.css";
import formatCurrency from "../../utils/formatCurrency";
import classNames from "classnames";

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const progressPercentage = Math.min(
    (budget.amountSpent / budget.amountLimit) * 100,
    100
  );
  const isOverBudget = budget.amountSpent > budget.amountLimit;
  const isNearLimit = progressPercentage >= 80 && progressPercentage < 100;

  // Xác định trạng thái và thông báo
  const getStatusInfo = () => {
    if (isOverBudget) {
      return {
        status: "over",
        message: "Đã vượt ngân sách",
        icon: "fa-solid fa-exclamation-triangle",
        className: style.overBudget,
      };
    } else if (isNearLimit) {
      return {
        status: "warning",
        message: "Sắp hết ngân sách",
        icon: "fa-solid fa-exclamation-circle",
        className: style.nearLimit,
      };
    } else {
      return {
        status: "safe",
        message: "Trong tầm kiểm soát",
        icon: "fa-solid fa-check-circle",
        className: style.safe,
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={classNames(style.budgetCard, statusInfo.className)}>
      <div className={style.cardHeader}>
        <div className={style.categoryInfo}>
          <div
            className={style.categoryIcon}
            style={{ backgroundColor: budget.category.colorCode }}
          >
            <i className={budget.category.icon.iconClass}></i>
          </div>
          <div className={style.categoryDetails}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                paddingBottom: "4px",
              }}
            >
              <h4>{budget.category.name}</h4>
              {/* Hiển thị thông tin lặp lại */}
              {budget.isRecurring && (
                <span className={style.recurringBadge}>
                  <i className="fa-solid fa-repeat"></i>
                  <span>Lặp lại</span>
                </span>
              )}
            </div>
            <p className={style.budgetPeriod}>
              {budget.startDate} - {budget.endDate}
            </p>
          </div>
        </div>
        <div className={style.cardActions}>
          <button
            className={style.editBtn}
            onClick={() => onEdit && onEdit(budget)}
            title="Chỉnh sửa ngân sách"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
          <button
            className={style.deleteBtn}
            onClick={() => onDelete && onDelete(budget.id)}
            title="Xóa ngân sách"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <div className={style.budgetAmounts}>
        <div className={style.amountInfo}>
          <span className={style.amountLabel}>Đã chi</span>
          <span
            className={classNames(style.amountValue, {
              [style.warningAmount]: isNearLimit,
              [style.overAmount]: isOverBudget,
            })}
          >
            {formatCurrency(budget.amountSpent || 0)}
          </span>
        </div>
        <div className={style.amountInfo}>
          <span className={style.amountLabel}>Ngân sách</span>
          <span className={style.amountValue}>
            {formatCurrency(budget.amountLimit)}
          </span>
        </div>
      </div>

      <div className={style.progressSection}>
        <div className={style.progressBar}>
          <div
            className={classNames(style.progressFill, {
              [style.warningProgress]: isNearLimit,
              [style.overProgress]: isOverBudget,
            })}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className={style.progressInfo}>
          <span
            className={classNames(style.progressPercentage, {
              [style.warningPercentage]: isNearLimit,
              [style.overPercentage]: isOverBudget,
            })}
          >
            {progressPercentage.toFixed(0)}%
          </span>
          <span className={style.remainingAmount}>
            {isOverBudget
              ? `Vượt ${formatCurrency(
                  budget.amountSpent - budget.amountLimit
                )}`
              : `Còn ${formatCurrency(
                  budget.amountLimit - budget.amountSpent
                )}`}
          </span>
        </div>
      </div>

      {/* Thông báo trạng thái */}
      <div className={style.statusMessage}>
        <i className={statusInfo.icon}></i>
        <span>{statusInfo.message}</span>
      </div>
    </div>
  );
};

export default BudgetCard;
