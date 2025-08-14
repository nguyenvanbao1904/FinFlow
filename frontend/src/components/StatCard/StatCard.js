import style from "./statCard.module.css";
import classNames from "classnames";
const StatCard = ({ type, isPositive, icon, content }) => {
  return (
    <div className={classNames(style.statCard, style[`${type}Card`])}>
      <div className={style.cardHeader}>
        <div className={style.cardIcon}>
          <i className={icon}></i>
        </div>
        <div
          className={`${style.cardTrend} ${
            isPositive ? style.positive : style.negative
          }`}
        >
          {content.percentage > 0 ? (
            <i className="fa-solid fa-arrow-up"></i>
          ) : (
            <i className="fa-solid fa-arrow-down"></i>
          )}

          <span>
            {content.percentage < 0 ? "" : "+"}
            {content.percentage}%
          </span>
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
