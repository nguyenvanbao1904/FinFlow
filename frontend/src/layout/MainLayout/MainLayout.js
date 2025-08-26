import style from "./mainLayout.module.css";
import AuroraBlob from "../../components/AuroraBlob/AuroraBlob";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <div>
      <AuroraBlob />
      <Sidebar />
      <main className={style.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
