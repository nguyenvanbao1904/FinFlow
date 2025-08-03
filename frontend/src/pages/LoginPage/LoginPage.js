import style from './loginPage.module.css';
import layoutStyle from '../../assets/styles/layout.module.css';
import AuroraBlob from '../../components/AuroraBlob/AuroraBlob';
import Header from '../../components/Header/Header';
import Form from '../../components/Form/Form';
import FormGroup from '../../components/Form/FormGroup';
import FormOption from '../../components/Form/FormOption';
import { Link } from 'react-router-dom';
import SubmitButton from '../../components/Button/SubmitButton';
import Button from '../../components/Button/Button';
import FeaturesCard from '../LandingPage/FeaturesCard'
import {benefitsInfo} from './loginPageData'
import {useEffect, useState } from 'react';
import { loginUser } from '../../redux/features/auth/authThunks';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import oauthConfig from '../../configs/oauthConfig';
import {selectUser} from '../../redux/features/auth/authSelectors'

const LoginPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(selectUser);

    useEffect(()=>{
        if (user) {
            navigate("/dashboard");
        }
    },[user, navigate])


    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(loginUser({ username, password }, navigate))

    }

    const handleGoogleLogin = (e) => {
        e.preventDefault();
         const callbackUrl = oauthConfig.redirectUri;
        const authUrl = oauthConfig.authUri;
        const googleClientId = oauthConfig.clientId;

        const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
            callbackUrl
        )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

        window.location.href = targetUrl;
    }
    

    return <>
        <div className={style.loginWrapper}>
            <AuroraBlob />
            <Header isShowMenu={false} isShowButton={false}/>

            <main className={style.loginMain}>
            <div className={layoutStyle.container}>
                <div className={style.loginContainer}>
                    <div className={style.loginFormSection}>
                        <div className={style.formHeader}>
                            <h1>Chào mừng trở lại!</h1>
                            <p>Đăng nhập để tiếp tục quản lý tài chính thông minh</p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <FormGroup label="Tên đăng nhập" type="text" placeholder="YourUsername@123" icon="fa-solid fa-user" value={username} setValue={setUsername} />
                            <FormGroup label="Mật khẩu" type="password" placeholder="Nhập mật khẩu" icon="fa-solid fa-lock" value={password} setValue={setPassword} />
                            <FormOption text="Ghi nhớ đăng nhập">
                                <Link to={"/"} className={style.forgotPassword}>Quên mật khẩu?</Link>
                            </FormOption>
                            <SubmitButton text="Đăng nhập" type="submit" />
                             <div className={style.divider}>
                                <span>hoặc</span>
                            </div>
                            <div className={style.socialLogin}>
                                <Button isPrimary={false} text="Đăng nhập với Google" icon="fab fa-google" onClick={handleGoogleLogin}/>
                                <Button isPrimary={false} text="Đăng nhập với Facebook" icon="fab fa-facebook" />
                            </div>
                            <div className={style.signupLink}>
                                <p>Chưa có tài khoản? <Link to={"/register"}>Đăng ký ngay</Link></p>
                            </div>
                        </Form>
                    </div>
                    <div className={style.loginFeaturesSection}>
                        <FeaturesCard featureCardInfo={benefitsInfo} />
                    </div>
                </div>
            </div>
        </main>
        </div>
    </>
}

export default LoginPage;