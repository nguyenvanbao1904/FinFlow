import AuroraBlob from "../../components/AuroraBlob/AuroraBlob";
import Header from "../../components/Header/Header";
import style from '../LoginPage/loginPage.module.css';
import layoutStyle from '../../assets/styles/layout.module.css';
import Form from "../../components/Form/Form";
import FormGroup from "../../components/Form/FormGroup";
import { useState, useEffect} from "react";
import SubmitButton from "../../components/Button/SubmitButton";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import FeaturesCard from "../LandingPage/FeaturesCard";
import {benefitsInfo} from '../LoginPage/loginPageData'
import oauthConfig from '../../configs/oauthConfig';
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { endpoints } from "../../configs/apis";
import { Box, CircularProgress, Typography } from "@mui/material";
import {useSelector} from "react-redux";
import {selectUser} from '../../redux/features/auth/authSelectors'

const RegisterPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {isLoading, callApi} = useApi();
    const navigate = useNavigate();

    const user = useSelector(selectUser);

    useEffect(()=>{
        if (user) {
            navigate("/dashboard");
        }
    },[user, navigate])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
            return;
        }
        const userData = {
            username,
            password,
            firstName: '',
            lastName: '',
            dob: null,
        };

        try {
            await callApi('POST', endpoints.users.register, userData, true);
            navigate("/login");
        } catch (err) {
         alert(`Đăng ký không thành công: ${err.message}`);
     }
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

  return (
    <>
        {isLoading ? <><Box
            sx={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            }}
        >
            <CircularProgress></CircularProgress>
            <Typography>Authenticating...</Typography>
        </Box></>

        : <>
            <div className={style.loginWrapper}>
        <AuroraBlob />
        <Header isShowMenu={false} isShowButton={false}/>

        <main className={style.loginMain}>
            <div className={layoutStyle.container}>
                <div className={style.loginContainer}>
                    <div className={style.loginFormSection}>
                        <div className={style.formHeader}>
                            <h1>FinFlow - Trợ Lý Tài Chính Cá Nhân Toàn Diện</h1>
                            <p>Đăng Ký Tài Khoản Để Có Trải Nghiệm Đầy Đủ Nhất</p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <FormGroup label="Tên đăng nhập" type="text" placeholder="YourUsername@123" icon="fa-solid fa-user" value={username} setValue={setUsername} />
                            <FormGroup label="Mật khẩu" type="password" placeholder="Nhập mật khẩu" icon="fa-solid fa-lock" value={password} setValue={setPassword} />
                            <FormGroup label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" icon="fa-solid fa-lock" value={confirmPassword} setValue={setConfirmPassword} />
                            <SubmitButton text="Đăng ký" type="submit" />
                             <div className={style.divider}>
                                <span>hoặc</span>
                            </div>
                            <div className={style.socialLogin}>
                                <Button isPrimary={false} text="Đăng nhập với Google" icon="fab fa-google" onClick={handleGoogleLogin}/>
                                <Button isPrimary={false} text="Đăng nhập với Facebook" icon="fab fa-facebook" />
                            </div>
                            <div className={style.signupLink}>
                                <p>Đã có tài khoản? <Link to={"/login"}>Đăng nhập ngay</Link></p>
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
        </>}
    </>
    
  );
};

export default RegisterPage;