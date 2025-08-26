import style from "./statCard.module.css";
import classNames from "classnames";
const StatCard = ({ type, icon, content }) => {
  return (
    <div className={classNames(style.statCard, style[`${type}Card`])}>
      <div className={style.cardHeader}>
        <div className={style.cardIcon}>
          <i
            className={
              type === "income"
                ? "fa-solid fa-arrow-up"
                : type === "expense"
                ? "fa-solid fa-arrow-down"
                : type === "balance"
                ? "fa-solid fa-wallet"
                : "fa-solid fa-piggy-bank"
            }
          ></i>
        </div>
      </div>
      <div className={style.cardContent}>
        <h3>{content.title}</h3>
        <div className={classNames(style.cardValue, style[`${type}Color`])}>
          {content.value}
        </div>
        <p className={style.cardPeriod}>{content.period}</p>
      </div>
    </div>
  );
};

export default StatCard;
