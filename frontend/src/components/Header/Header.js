import style from './header.module.css';
import layoutStyle from '../../assets/styles/layout.module.css';
import PrimaryButton from '../Button/LinkButton';
import { Link } from 'react-router-dom';

const Header = ({isShowMenu = true, isShowButton = true}) => {
    return (
        <header>
            <div className={`${style.navContainer} ${layoutStyle.container}`}>
                    <Link to="/" className={style.logo}>FinFlow.</Link>
                    {isShowMenu &&
                        <nav>
                            <a href="#features">Tính năng</a>
                            <a href="#how-it-works">Cách hoạt động</a>
                            <a href="#testimonials">Đánh giá</a>
                        </nav>
                    }
                    <div className={style.headerControls}>
                        <div className={style.languageSwitch}>
                            <span className={`${style.langOption} ${style.active}`} data-lang="vi">VI</span>
                            <span className={style.langOption} data-lang="en">EN</span>
                        </div>
                        <div id="theme-toggle" className={style.themeToggle}>
                            <i className="fas fa-moon"></i>
                        </div>
                        {isShowButton && <PrimaryButton isLarge={false} text="Bắt đầu ngay" icon="fa-solid fa-arrow-right" href="/dashboard"/>}
                    </div>
                </div>
        </header>
    );
}

export default Header;