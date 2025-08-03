import style from './featuresCard.module.css';
import layoutStyle from '../../assets/styles/layout.module.css';

const FeaturesCard = ({title, featureCardInfo, id}) => {

    return (
        <section id={id}>
                <div className={layoutStyle.container}>
                    <h2 className={layoutStyle.sectionTitle} data-lang-key="featuresTitle">{title}</h2>
                    <div className={style.featuresGrid}>
                        {featureCardInfo.map((feature, index) => (
                            <div className={style.featureCard} key={index}>
                                <div className={style.cardIconWrapper}>
                                    <i className={`${feature.icon} ${style.cardIcon}`}></i>
                                </div>
                                <h3 className={style.featureCardTitle} data-lang-key={`feature${index + 1}Title`}>{feature.title}</h3>
                                <p className={style.featureCardDesc} data-lang-key={`feature${index + 1}Desc`}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
        </section>
    )
}

export default FeaturesCard;