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
}) => {
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
  return (
    <div className={style.cardContainer}>
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
