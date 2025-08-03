import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/features/auth/authSelectors";
import Button from "../../components/Button/Button";
import { logoutUser } from "../../redux/features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardPage = () => {
    const user = useSelector(selectUser);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            {user && <>
                <h1>Hello {user.username}</h1>
                <Button onClick={() => {
                   dispatch(logoutUser(navigate));
                }} text={"Logout"} isPrimary={true}></Button>
            </>}
        </div>
    );
};

export default DashboardPage;