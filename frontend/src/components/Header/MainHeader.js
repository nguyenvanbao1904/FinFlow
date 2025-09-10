import { useEffect, useState } from "react";
import Button from "../Button/Button";
import style from "./mainHeader.module.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import Form from "../Form/Form";
import FormGroup from "../Form/FormGroup";

const MainHeader = ({
  title,
  subTitle,
  onChangePeriod,
  buttonText,
  buttonIcon,
  onClickButton,
  onSubmitInput,
  placeholderInput,
  iconInput,
  isShowPeriod = true,
  isShowButton = true,
  isShowInput = true,
}) => {
  const [typePeriod, settypePeriod] = useState("WEEK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [inputValue, setInputValue] = useState("");

  const handleClickPeriod = (period) => {
    settypePeriod(period);
    setCurrentDate(dayjs());
  };

  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(1, typePeriod.toLowerCase()));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(1, typePeriod.toLowerCase()));
  };

  useEffect(() => {
    if (isShowPeriod && onChangePeriod) {
      const newStartDate = currentDate
        .startOf(typePeriod.toLowerCase())
        .format("DD/MM/YYYY");
      const newEndDate = currentDate
        .endOf(typePeriod.toLowerCase())
        .format("DD/MM/YYYY");

      setStartDate(newStartDate);
      setEndDate(newEndDate);

      onChangePeriod(newStartDate, newEndDate, typePeriod);
    }
  }, [currentDate, typePeriod, onChangePeriod, isShowPeriod]);

  return (
    <>
      <header className={style.mainHeader}>
        <div className={style.headerLeft}>
          <h1>{title}</h1>
          <p className={style.headerSubtitle}>{subTitle}</p>
        </div>
        {isShowPeriod && (
          <div className={style.headerCenter}>
            <Button
              icon="fa-solid fa-angle-left"
              isLarge={false}
              isPrimary={false}
              onClick={handlePrev}
            />
            <h3>
              {startDate} - {endDate}
            </h3>
            <Button
              icon="fa-solid fa-angle-right"
              isLarge={false}
              isPrimary={false}
              onClick={handleNext}
            />
          </div>
        )}
        <div className={style.headerRight}>
          <div className={style.headerControls}>
            {isShowPeriod && (
              <div className={style.timeFilter}>
                <Button
                  text="Tuần"
                  isLarge={false}
                  key="week"
                  isPrimary={typePeriod === "WEEK"}
                  onClick={() => handleClickPeriod("WEEK")}
                />
                <Button
                  text="Tháng"
                  isLarge={false}
                  key="month"
                  isPrimary={typePeriod === "MONTH"}
                  onClick={() => handleClickPeriod("MONTH")}
                />
                <Button
                  text="Năm"
                  isLarge={false}
                  key="year"
                  isPrimary={typePeriod === "YEAR"}
                  onClick={() => handleClickPeriod("YEAR")}
                />
              </div>
            )}
            {isShowButton && buttonText && (
              <Button
                text={buttonText}
                icon={buttonIcon}
                isLarge={false}
                isPrimary={true}
                onClick={onClickButton}
              />
            )}
            {isShowInput && (
              <Form onSubmit={(e) => onSubmitInput(e, inputValue)}>
                <FormGroup
                  icon={iconInput}
                  placeholder={placeholderInput}
                  type="text"
                  key="mainHeaderInput"
                  value={inputValue}
                  setValue={setInputValue}
                />
              </Form>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
