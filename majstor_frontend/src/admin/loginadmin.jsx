import React, { useState } from "react";
import backgroundImage from "../assets/background.jpg";
import { useMediaQuery } from "@react-hook/media-query";
import { Toaster, toast } from "sonner";
import { Input } from "@nextui-org/react";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import ButtonStyle from "../signup-login/components/button";

const LoginAdmin = () => {
  const isSmallScreen = useMediaQuery("(max-width: 48em)");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please provide your credentials.", {
        duration: 3000,
      });
    }
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        mail: username,
        password: password,
      });

      console.log("Login response:", response.data);
      localStorage.setItem("token", response.data.token);

      // navigate("/");
      window.location.href = "/homeadmin";
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(
          "Invalid username or password. Please check your credentials and try again.",
          {
            duration: 3000,
          }
        );
      }
    }
  };

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
        <h1 className="text-3xl font-bold text-center p-2">Log In</h1>

        <div className="input space-y-4">
          <Input
            isRequired
            type="text"
            label="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            isRequired
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <ButtonStyle onClick={handleLogin}>Log In</ButtonStyle>

        <div className="form-link p-2 text-center"></div>
      </div>
    </div>
  );
};

export default LoginAdmin;
