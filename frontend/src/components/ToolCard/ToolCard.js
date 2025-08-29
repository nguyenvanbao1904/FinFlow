import style from "./toolCard.module.css";

const ToolCard = ({ tool, onClick, isActive = false }) => {
  return (
    <div
      className={`${style.toolOverviewCard} ${isActive ? style.active : ""}`}
      onClick={() => onClick && onClick(tool.id)}
    >
      <div className={style.toolIcon}>
        <i className={tool.icon}></i>
      </div>
      <div className={style.toolCardInfo}>
        <h4>{tool.title}</h4>
        <p>{tool.description}</p>
        <ul className={style.toolFeatures}>
          {tool.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <div
        className={
          style.toolStatus + (tool.isAvailable ? "" : " " + style.comingSoon)
        }
      >
        {tool.isAvailable ? (
          <span className={style.available}>Sẵn sàng</span>
        ) : (
          <span>Sắp ra mắt</span>
        )}
      </div>
    </div>
  );
};

export default ToolCard;
