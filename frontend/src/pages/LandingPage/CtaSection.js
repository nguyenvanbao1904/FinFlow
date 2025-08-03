import style from './ctaSection.module.css';
import layoutStyle from '../../assets/styles/layout.module.css';
import LinkButton from '../../components/Button/LinkButton';

const CtaSection = () => {
    return (
        <section className={`${style.cta} ${layoutStyle.container}`}>
            <div className={style.ctaCard}>
                <h2 data-lang-key="ctaTitle">Bắt đầu hành trình tự do tài chính của bạn ngay hôm nay.</h2>
                <p data-lang-key="ctaSubtitle">Không thẻ tín dụng. Không ràng buộc. Hoàn toàn miễn phí để bắt đầu.</p>
                <LinkButton isLarge={true} text="Tạo tài khoản miễn phí" icon="fa-solid fa-rocket" href="/register"/>
            </div>
        </section>
    )
}

export default CtaSection;