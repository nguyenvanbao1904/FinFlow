import style from "./formOption.module.css";

const FormOption = ({ text, onChange, checked, children }) => {
  return (
    <div className={style.formOptions}>
      <label className={style.checkboxWrapper}>
        <input
          type="checkbox"
          id="remember-me"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={style.checkmark}></span>
        {text}
      </label>
      {children}
    </div>
  );
};

export default FormOption;
