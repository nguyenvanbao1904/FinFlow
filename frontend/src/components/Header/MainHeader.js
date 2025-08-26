import { useEffect, useState } from "react";
import Button from "../Button/Button";
import style from "./mainHeader.module.css";
import AddTransactionModal from "../Modal/AddTransactionModal";
import { useDispatch, useSelector } from "react-redux";
import { selectPeriod } from "../../redux/features/transaction/transactionSelectors";
import { setPeriod } from "../../redux/features/transaction/transactionSlice";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const MainHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  const [transactionPeriod, setTransactionPeriod] = useState("WEEK");
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const period = useSelector(selectPeriod);

  const handleClickPeriod = (period) => {
    setTransactionPeriod(period);
    setCurrentDate(dayjs());
  };

  const handlePrev = () => {
    setCurrentDate(currentDate.subtract(1, transactionPeriod.toLowerCase()));
  };

  const handleNext = () => {
    setCurrentDate(currentDate.add(1, transactionPeriod.toLowerCase()));
  };

  useEffect(() => {
    const newStartDate = currentDate
      .startOf(transactionPeriod.toLowerCase())
      .format("DD/MM/YYYY");
    const newEndDate = currentDate
      .endOf(transactionPeriod.toLowerCase())
      .format("DD/MM/YYYY");

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    if (
      !(
        period.type === transactionPeriod &&
        period.startDate === newStartDate &&
        period.endDate === newEndDate
      )
    ) {
      dispatch(
        setPeriod({
          type: transactionPeriod,
          startDate: newStartDate,
          endDate: newEndDate,
        })
      );
    }
  }, [currentDate, transactionPeriod, dispatch, period]);

  return (
    <>
      <header className={style.mainHeader}>
        <div className={style.headerLeft}>
          <h1>Dashboard</h1>
          <p className={style.headerSubtitle}>Tổng quan tài chính của bạn</p>
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
                isPrimary={transactionPeriod === "WEEK"}
                onClick={() => handleClickPeriod("WEEK")}
              />
              <Button
                text="Tháng"
                isLarge={false}
                key="month"
                isPrimary={transactionPeriod === "MONTH"}
                onClick={() => handleClickPeriod("MONTH")}
              />
              <Button
                text="Năm"
                isLarge={false}
                key="year"
                isPrimary={transactionPeriod === "YEAR"}
                onClick={() => handleClickPeriod("YEAR")}
              />
            </div>
            <Button
              text="Thêm giao dịch"
              icon="fa-solid fa-plus"
              isLarge={false}
              isPrimary={true}
              onClick={() => setOpenModal(true)}
            />
          </div>
        </div>
      </header>
      <AddTransactionModal
        openModal={openModal}
        closeModalHandler={() => setOpenModal(false)}
      />
    </>
  );
};

export default MainHeader;
