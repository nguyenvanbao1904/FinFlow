import layoutStyle from "../../assets/styles/layout.module.css";
import classNames from "classnames";

const Button = ({ isLarge, text, icon, onClick, isPrimary }) => {
  const className = classNames(
    layoutStyle.btn,
    { [layoutStyle.btnPrimary]: isPrimary },
    { [layoutStyle.btnLarge]: isLarge },
    { [layoutStyle.btnSecondary]: !isPrimary }
  );

  return (
    <button className={className} onClick={(e) => onClick(e)}>
      {text}
      <i className={icon}></i>
    </button>
  );
};

export default Button;
