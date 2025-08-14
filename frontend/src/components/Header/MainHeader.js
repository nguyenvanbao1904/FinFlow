import Button from "../Button/Button";
import style from "./mainHeader.module.css";
const MainHeader = () => {
  return (
    <header className={style.mainHeader}>
      <div className={style.headerLeft}>
        <h1>Dashboard</h1>
        <p className={style.headerSubtitle}>Tổng quan tài chính của bạn</p>
      </div>
      <div className={style.headerRight}>
        <div className={style.headerControls}>
          <div className={style.timeFilter}>
            <button
              className={`${style.filterBtn} ${style.active}`}
              data-period="week"
            >
              Tuần
            </button>
            <button className={style.filterBtn} data-period="month">
              Tháng
            </button>
            <button className={style.filterBtn} data-period="year">
              Năm
            </button>
          </div>
          <Button
            text="Thêm giao dịch"
            icon="fa-solid fa-plus"
            isLarge={false}
            isPrimary={true}
          />
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
