import style from "./chartCard.module.css";

const ChartCard = ({ title, legends, children }) => {
  return (
    <div className={style.chartContainer}>
      <div className={style.chartHeader}>
        <h3>{title}</h3>
        <div className={style.chartLegend}>
          {legends.map((legendItem, index) => {
            return (
              <div className={style.legendItem} key={index}>
                <span
                  className={style.legendColor}
                  style={{ backgroundColor: legendItem.color }}
                ></span>
                <span>{legendItem.title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.chartBody}>{children}</div>
    </div>
  );
};

export default ChartCard;
