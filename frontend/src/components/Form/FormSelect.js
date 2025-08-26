import { useState, useRef, useEffect } from "react";
import style from "./formSelect.module.css";

const FormSelect = ({
  label,
  icon,
  options,
  selectedValue,
  setSelectedValue,
  placeholder = "Chọn một tùy chọn",
  onScrollEnd,
  isLoading = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const optionsListRef = useRef(null);

  const handleSelect = (value) => {
    if (disabled) return;
    setSelectedValue(value);
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  // Xử lý scroll để load thêm data
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const threshold = 50;

    if (
      scrollHeight - scrollTop - clientHeight < threshold &&
      onScrollEnd &&
      !isLoading
    ) {
      onScrollEnd();
    }
  };

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <div className={style.formGroup} ref={selectRef}>
      {label && <label>{label}</label>}
      <div
        className={`${style.selectWrapper} ${disabled ? style.disabled : ""}`}
        onClick={handleToggleOpen}
      >
        {icon && (
          <i
            className={`${selectedOption?.icon ? selectedOption.icon : icon} ${
              style.inputIcon
            }`}
            style={{ color: selectedOption?.iconColor }}
          ></i>
        )}
        <div
          className={`${style.selectDisplay} ${
            !selectedOption ? style.placeholder : ""
          } ${disabled ? style.disabled : ""}`}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <i
            className={`fa-solid fa-chevron-down ${style.chevronIcon} ${
              isOpen ? style.open : ""
            } ${disabled ? style.disabled : ""}`}
          ></i>
        </div>
        {isOpen && !disabled && (
          <ul
            className={style.optionsList}
            ref={optionsListRef}
            onScroll={handleScroll}
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={`${style.optionItem} ${
                  selectedValue === option.value ? style.selected : ""
                }`}
                onClick={() => handleSelect(option.value)}
              >
                {option.icon && (
                  <div
                    className={style.optionIconWrapper}
                    style={{ backgroundColor: option.iconColor }}
                  >
                    <i className={`${option.icon} ${style.optionIcon}`}></i>
                  </div>
                )}
                {option.label}
              </li>
            ))}
            {/* Loading indicator */}
            {isLoading && (
              <li className={style.loadingItem}>
                <div className={style.loadingSpinner}>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Đang tải thêm...</span>
                </div>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FormSelect;
