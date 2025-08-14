import style from "./goalItem.module.css";
import formatCurrency from "../../utils/formatCurrency";

const GoalItem = ({ goal }) => {
  return (
    <div className={style.goalItem}>
      <div className={style.goalHeader}>
        <span className={style.goalName}>{goal.name}</span>
        <span className={style.goalProgress}>
          {((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)}%
        </span>
      </div>
      <div className={style.goalBar}>
        <div
          className={style.goalFill}
          style={{
            width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
          }}
        ></div>
      </div>
      <div className={style.goalDetails}>
        <span>
          {formatCurrency(goal.currentAmount)} /{" "}
          {formatCurrency(goal.targetAmount)}
        </span>
        <span className={style.goalRemaining}>
          còn {formatCurrency(goal.targetAmount - goal.currentAmount)}
        </span>
      </div>
    </div>
  );
};

export default GoalItem;
