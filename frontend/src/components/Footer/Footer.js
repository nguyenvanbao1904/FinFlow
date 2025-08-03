import style from './footer.module.css';
import layoutStyle from '../../assets/styles/layout.module.css';

const Footer = ()=>{
    return (
       <footer>
            <div className={`${style.footerContainer} ${layoutStyle.container}`}>
                <div className={style.footerCol}>
                    <a href="#home" className={style.logo}>FinFlow.</a>
                    <p data-lang-key="footerTagline">Quản lý tài chính cá nhân thông minh và hiệu quả.</p>
                     <div className={style.socialIcons}>
                        <a href="https://www.facebook.com" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                        <a href="https://www.instagram.com" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="https://www.linkedin.com" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                        <a href="https://www.twitter.com" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    </div>
                </div>
                <div className={style.footerCol}>
                    <h4 data-lang-key="footerProduct">Sản phẩm</h4>
                    <a href="#features" data-lang-key="footerFeatures">Tính năng</a>
                    <a href="#how-it-works" data-lang-key="footerHowItWorks">Cách hoạt động</a>
                    <a href="#pricing" data-lang-key="footerPricing">Bảng giá</a>
                </div>
                <div className={style.footerCol}>
                    <h4 data-lang-key="footerCompany">Công ty</h4>
                    <a href="#features" data-lang-key="footerAbout">Về chúng tôi</a>
                    <a href="#features" data-lang-key="footerContact">Liên hệ</a>
                    <a href="#features" data-lang-key="footerCareers">Tuyển dụng</a>
                </div>
                <div className={style.footerCol}>
                    <h4 data-lang-key="footerLegal">Pháp lý</h4>
                    <a href="#features" data-lang-key="footerTerms">Điều khoản dịch vụ</a>
                    <a href="#features" data-lang-key="footerPrivacy">Chính sách bảo mật</a>
                </div>
            </div>
            <div className={`${layoutStyle.container} ${style.footerBottom}`}>
                <p data-lang-key="footerCopyright">© 2024 FinFlow. Đã đăng ký bản quyền.</p>
            </div>
        </footer>
    );
};

export default Footer;