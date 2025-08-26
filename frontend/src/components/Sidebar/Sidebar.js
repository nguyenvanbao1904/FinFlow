import Style from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSelectors";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

const Sidebar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser({ navigate }));
  };

  return (
    <aside className={Style.sidebar}>
      <div className={Style.sidebarHeader}>
        <Link to="/" className={Style.logo}>
          FinFlow.
        </Link>
        <button className={Style.sidebarToggle} id="sidebar-toggle">
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      <nav className={Style.sidebarNav}>
        <Link to="/dashboard" className={`${Style.navItem} ${Style.active}`}>
          <i className="fa-solid fa-chart-line"></i>
          <span>Dashboard</span>
        </Link>
        <Link to="/budgets" className={Style.navItem}>
          <i className="fa-solid fa-bullseye"></i>
          <span>Ngân sách</span>
        </Link>
        <Link to="/investment" className={Style.navItem}>
          <i className="fa-solid fa-briefcase"></i>
          <span>Đầu tư</span>
        </Link>
        <Link to="/planner" className={Style.navItem}>
          <i className="fa-solid fa-calculator"></i>
          <span>Công cụ</span>
        </Link>
        <Link to="#" className={Style.navItem}>
          <i className="fa-solid fa-chart-pie"></i>
          <span>Báo cáo</span>
        </Link>
      </nav>

      <div className={Style.sidebarFooter}>
        <div className={Style.userProfile}>
          <div className={Style.userAvatar}>
            <i className="fa-solid fa-user"></i>
          </div>
          <div className={Style.userInfo}>
            <span className={Style.userName}>Hello {user?.firstName}</span>
            <span className={Style.userUsername}>{user?.username}</span>
          </div>
        </div>
        <div className={Style.sidebarActions}>
          <Link to="#" className={Style.navItem}>
            <i className="fa-solid fa-cog"></i>
            <span>Cài đặt</span>
          </Link>
          <Button
            isLarge={false}
            text="Đăng xuất"
            icon="fa-solid fa-sign-out-alt"
            onClick={handleLogout}
            isPrimary={false}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
