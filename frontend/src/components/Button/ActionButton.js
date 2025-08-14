import style from "./actionButton.module.css";

const ActionButton = ({ text, icon }) => {
  return (
    <button className={style.actionBtn}>
      <i className={icon}></i>
      <span>{text}</span>
    </button>
  );
};

export default ActionButton;
