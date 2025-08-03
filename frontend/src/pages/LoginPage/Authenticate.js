import { Box, CircularProgress, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { outboundLogin } from "../../redux/features/auth/authThunks";
import { useNavigate } from "react-router-dom";

const Authenticate = () => {

    const authCodeRegex = /code=([^&]+)/;
    const isMatched = window.location.href.match(authCodeRegex);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (isMatched) {
        const authCode = isMatched[1];
        dispatch(outboundLogin(authCode, navigate));
    }
    return (
    <>
        <Box
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
        </Box>
        </>
    );
}

export default Authenticate;