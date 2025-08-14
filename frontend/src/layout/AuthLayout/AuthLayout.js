import style from "./authLayout.module.css";
import layoutStyle from "../../assets/styles/layout.module.css";
import AuroraBlob from "../../components/AuroraBlob/AuroraBlob";
import Header from "../../components/Header/Header";

const AuthLayout = ({ children }) => {
  return (
    <div className={style.authWrapper}>
      <AuroraBlob />
      <Header isShowMenu={false} isShowButton={false} />

      <main className={style.authMain}>
        <div className={layoutStyle.container}>
          <div className={style.authContainer}>{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
