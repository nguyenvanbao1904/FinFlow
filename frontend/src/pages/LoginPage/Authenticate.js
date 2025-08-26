import { useDispatch } from "react-redux";
import { outboundLogin } from "../../redux/features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

const Authenticate = () => {
  const authCodeRegex = /code=([^&]+)/;
  const isMatched = window.location.href.match(authCodeRegex);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isMatched) {
    const authCode = isMatched[1];
    dispatch(outboundLogin({ authCode, navigate }));
  }
  return <Spinner text="Authenticating..." />;
};

export default Authenticate;
