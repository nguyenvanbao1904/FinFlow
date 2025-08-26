import style from "./transactionCard.module.css";
import formatCurrency from "../../utils/formatCurrency";
import Button from "../Button/Button";

const TransactionCard = ({
  color,
  icon,
  title,
  description,
  date,
  amount,
  type,
  onEdit,
  onDelete,
  showActions = false,
  transactionId,
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
      <div className={style.transactionRight}>
        {showActions && (
          <div className={style.transactionActions}>
            <Button
              icon="fa-solid fa-pen-to-square"
              isLarge={false}
              isPrimary={false}
              onClick={() => onEdit && onEdit(transactionId)}
              className={style.actionButton}
            />
            <Button
              icon="fa-solid fa-trash"
              isLarge={false}
              isPrimary={false}
              onClick={() => onDelete && onDelete(transactionId)}
              className={`${style.actionButton} ${style.deleteButton}`}
            />
          </div>
        )}
        <div className={`${style.transactionAmount} ${style[type]}`}>
          {type === "expense" ? "" : "+"}
          {type === "expense"
            ? `-${formatCurrency(amount)}`
            : `${formatCurrency(amount)}`}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
