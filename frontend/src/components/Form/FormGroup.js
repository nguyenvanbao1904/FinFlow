import style from "./formGroup.module.css";
import { useState, useRef } from "react";

const FormGroup = ({
  label,
  placeholder,
  icon,
  type,
  required = true,
  value,
  setValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = () => {
    if (type === "date" && inputRef.current?.showPicker) {
      inputRef.current.showPicker();
    }
  };

  const inputType = type === "password" && showPassword ? "text" : type;
  const passwordIcon = showPassword
    ? "fa-solid fa-eye-slash"
    : "fa-solid fa-eye";

  return (
    <div className={style.formGroup}>
      <label htmlFor={label}>{label}</label>
      <div className={style.inputWrapper} onClick={handleClick}>
        {icon && <i className={`${icon} ${style.inputIcon}`}></i>}
        <input
          ref={inputRef}
          type={inputType}
          id={label}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {type === "password" && (
          <button
            type="button"
            className={style.togglePassword}
            onClick={togglePasswordVisibility}
          >
            <i className={passwordIcon}></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default FormGroup;
