import style from "./mainLayout.module.css";
import AuroraBlob from "../../components/AuroraBlob/AuroraBlob";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { useNavigate } from "react-router-dom";
const MainLayout = ({ children }) => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div>
      <AuroraBlob />
      <Sidebar />
      <main className={style.mainContent}>{children}</main>
    </div>
  );
};

export default MainLayout;
