import Button from "../Button/Button";
import chartStyle from "../ChartCard/chartCard.module.css";

const ContentCard = ({ title, iconButton, titleButton, onclick, children }) => {
  return (
    <div className={chartStyle.chartContainer}>
      <div className={chartStyle.chartHeader}>
        <h3>{title}</h3>
        {titleButton && (
          <Button
            icon={iconButton}
            isLarge={false}
            isPrimary={true}
            onClick={onclick}
            text={titleButton}
          />
        )}
      </div>
      <div className={chartStyle.chartBody}>{children}</div>
    </div>
  );
};

export default ContentCard;
