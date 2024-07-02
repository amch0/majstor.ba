import "./App.css";
import React from "react";
import CustomNavbar from "./customNavbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./homePage/homePage";
import AboutUs from "./aboutusPage/aboutUs";
import Signup from "./signup-login/signupPage";
import Login from "./signup-login/loginPage";
import UserDetails from "./userDetails/userDetails";
import CustomFooter from "./customFooter";
import PostDetails from "./postDetails/postDetails";
import ResetPassword from "./signup-login/resetPassword";
import UserAccountPage from "./UserAccountPage/UserAccountPage";
import HomeAdmin from "./admin/homeadmin";
import LoginAdmin from "./admin/loginadmin";
import AdminUserDetails from "./admin/adminUserDetails";
import AdminPostDetails from "./admin/adminPostDetails";

function App() {
  const navigate = useNavigate();
  return (
    <>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        <Route
          path="/userId/:userId"
          element={<UserDetails navigate={navigate} />}
        />
        <Route
          path="/post/:postId"
          element={<PostDetails navigate={navigate} />}
        />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/myAcc" element={<UserAccountPage />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/homeadmin" element={<HomeAdmin />} />
        <Route
          path="/admin/userId/:userId"
          element={<AdminUserDetails navigate={navigate} />}
        />
        <Route
          path="/admin/post/:postId"
          element={<AdminPostDetails navigate={navigate} />}
        />
      </Routes>
      <CustomFooter />
    </>
  );
}

export default App;
