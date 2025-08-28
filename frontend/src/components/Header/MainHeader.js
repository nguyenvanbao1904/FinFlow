import { useEffect, useState } from "react";
import Button from "../Button/Button";
import style from "./mainHeader.module.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const MainHeader = ({
  title,
  subTitle,
  onChangePeriod,
  buttonText,
  buttonIcon,
  onClickButton,
}) => {
  const [typePeriod, settypePeriod] = useState("WEEK");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentDate, setCurrentDate] = useState(dayjs());

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
    const newStartDate = currentDate
      .startOf(typePeriod.toLowerCase())
      .format("DD/MM/YYYY");
    const newEndDate = currentDate
      .endOf(typePeriod.toLowerCase())
      .format("DD/MM/YYYY");

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    onChangePeriod(newStartDate, newEndDate, typePeriod);
  }, [currentDate, typePeriod, onChangePeriod]);

  return (
    <>
      <header className={style.mainHeader}>
        <div className={style.headerLeft}>
          <h1>{title}</h1>
          <p className={style.headerSubtitle}>{subTitle}</p>
        </div>
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
        <div className={style.headerRight}>
          <div className={style.headerControls}>
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
            <Button
              text={buttonText}
              icon={buttonIcon}
              isLarge={false}
              isPrimary={true}
              onClick={onClickButton}
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default MainHeader;
