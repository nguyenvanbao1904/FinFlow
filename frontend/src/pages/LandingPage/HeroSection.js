import style from './heroSection.module.css';
import layoutStyle from '../../assets/styles/layout.module.css';
import LinkButton from '../../components/Button/LinkButton';

const HeroSection = () => {
    return (
         <section className={style.hero}>
                <div className={`${style.heroContainer} ${layoutStyle.container}`}>
                    <div className={style.heroContent}>
                        <div className={style.pill} data-lang-key="heroPill">✨ Phân tích bởi AI</div>
                        <h1 data-lang-key="heroTitle">
                            <span className={style.gradientText}>Kiểm Soát Tài Chính,</span><br/>
                            Mở Lối Tự Do.
                        </h1>
                        <p className={style.subtitle} data-lang-key="heroSubtitle">FinFlow là trợ lý tài chính thông minh, giúp bạn quản lý mọi dòng tiền, đầu tư hiệu quả và đạt mục tiêu nhanh hơn.</p>
                        <LinkButton isLarge={true} text="Trải nghiệm ngay" icon="fa-solid fa-arrow-right" href="/dashboard"/>
                    </div>
                </div>
        </section>
    )
}
export default HeroSection;