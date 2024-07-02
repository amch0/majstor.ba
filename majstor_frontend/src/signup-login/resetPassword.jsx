import React, { useState } from "react";
import ButtonStyle from "./components/button";
import backgroundImage from "../assets/background.jpg";
import { Input, Link } from "@nextui-org/react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useMediaQuery } from "@react-hook/media-query";

const ResetPassword = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cisVisible, csetIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const ctoggleVisibility = () => csetIsVisible(!cisVisible);
  const isSmallScreen = useMediaQuery("(max-width: 48em)");

  const [formData, setFormData] = useState({
    mail: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      formData.newPassword.length < 8 ||
      !/[A-Z]/.test(formData.newPassword)
    ) {
      console.error("Your password is not valid");
      toast.error("Your password is not valid");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      console.error("New password and confirm password do not match.");
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/reset-password",
        formData
      );

      console.log("Server response:", response.data);

      setResetSuccess(true);
    } catch (error) {
      console.error("Error while resetting password:", error);

      if (error.response && error.response.status === 404) {
        toast.error("User not found. Please check your email and try again.", {
          duration: 3000,
        });
      } else {
        toast.error("An error occurred while resetting your password.", {
          duration: 3000,
        });
      }
    }
  };

  if (resetSuccess) {
    return (
      <div
        className={` flex items-center justify-center ${
          isSmallScreen ? "" : "bg-cover bg-center bg-no-repeat h-screen"
        }`}
        style={
          isSmallScreen ? {} : { backgroundImage: `url(${backgroundImage})` }
        }
      >
        <div className="form bg-slate-50 p-8 rounded-lg space-y-4 w-full md:w-4/12 ">
          <h1 className="text-3xl font-bold text-center p-2">
            Password Reset Successful
          </h1>
          {/* <p className="text-center">
            Your password has been successfully reset. Please go to the login
            page.
          </p> */}
          <span className="text-center">
            Your password has been successfully reset. Please go to the{" "}
            <Link
              href="/login"
              className="link login"
              style={{ textDecoration: "underline" }}
            >
              Login
            </Link>{" "}
            page
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={` flex items-center justify-center ${
        isSmallScreen ? "" : "bg-cover bg-center bg-no-repeat h-screen"
      }`}
      style={
        isSmallScreen ? {} : { backgroundImage: `url(${backgroundImage})` }
      }
    >
      <Toaster richColors position="top-right" />
      <div className="form bg-slate-50 p-8 rounded-lg space-y-4 w-full md:w-4/12 ">
        <h1 className="text-3xl font-bold text-center p-2">Reset Password</h1>

        <div className="input space-y-4">
          <Input
            isRequired
            type="email"
            name="mail"
            label="Email"
            placeholder="example@gmail.com"
            value={formData.mail}
            onChange={handleChange}
          />

          <Input
            isRequired
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            label="New password"
            placeholder="Enter your password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <Input
            isRequired
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            label="Confirm password"
            placeholder="Enter your password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={ctoggleVisibility}
              >
                {cisVisible ? (
                  <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={cisVisible ? "text" : "password"}
          />
        </div>

        <ButtonStyle onClick={handleSubmit}>Change Password</ButtonStyle>
      </div>
    </div>
  );
};

export default ResetPassword;
