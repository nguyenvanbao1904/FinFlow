import style from "./transactionCard.module.css";
const TransactionCard = ({
  color,
  icon,
  title,
  description,
  date,
  amount,
  type,
}) => {
  return (
    <div className={style.transactionItem}>
      <div className={style.transactionIcon} style={{ backgroundColor: color }}>
        <i className={icon}></i>
      </div>
      <div className={style.transactionDetails}>
        <span className={style.category}>{title}</span>
        <span className={style.description}>{description}</span>
        <span className={style.date}>{date}</span>
      </div>
      <div className={`${style.transactionAmount} ${style[type]}`}>
        {type === "expense" ? "" : "+"}
        {amount}₫
      </div>
    </div>
  );
};

export default TransactionCard;
