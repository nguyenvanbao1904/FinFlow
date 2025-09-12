import Button from "../Button/Button";
import style from "./contentCard.module.css";

const ContentCard = ({
  title,
  iconButton,
  titleButton,
  onclick,
  children,
  onScrollEnd,
  isLoading,
  cardSize = "small", // Thêm prop cardSize với giá trị mặc định
}) => {
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const threshold = 50;

    if (
      scrollHeight - scrollTop - clientHeight < threshold &&
      onScrollEnd &&
      !isLoading
    ) {
      console.log(1);

      onScrollEnd();
    }
  };

  const cardClasses = `${style.cardContainer} ${style[cardSize]}`;

  return (
    <div className={cardClasses}>
      <div className={style.cardHeader}>
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
      <div className={style.cardBody} onScroll={handleScroll}>
        {children}
      </div>
    </div>
  );
};

export default ContentCard;
