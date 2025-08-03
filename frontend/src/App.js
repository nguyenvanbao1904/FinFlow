// App.js
import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { Provider, useDispatch } from 'react-redux'
import store from './redux/store';
import DashboardPage from "./pages/DashBoardPage/DashBoardPage";
import Authenticate from "./pages/LoginPage/Authenticate";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { useEffect } from "react";
import cookie from 'react-cookies'
import { introspect } from "./redux/features/auth/authThunks";

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = cookie.load('token');
    if (token) {
      dispatch(introspect(token));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/authenticate" element={<Authenticate />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
