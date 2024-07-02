import React, { useState, useEffect } from "react";
import ButtonStyle from "./components/button";
import backgroundImage from "../assets/background.jpg";
import { useMediaQuery } from "@react-hook/media-query";
import { Toaster, toast } from "sonner";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Link,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const isSmallScreen = useMediaQuery("(max-width: 48em)");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please provide your credentials.", {
        duration: 3000,
      });
    }
    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        mail: email,
        password: password,
      });

      console.log("Login response:", response.data);
      localStorage.setItem("token", response.data.token);

      // navigate("/");
      window.location.href = "/myAcc";
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          toast.error(
            "Invalid email or password. Please check your credentials and try again.",
            {
              duration: 3000,
            }
          );
        } else if (status === 403) {
          toast.error("Please verify your email.", {
            duration: 3000,
          });
        }
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Please provide your email.", {
        duration: 3000,
      });
    }
    const loadingToastId = toast.loading("Sending email");

    try {
      const response = await axios.post(
        "http://localhost:8080/users/forgot-password",
        {
          mail: forgotPasswordEmail,
        }
      );
      console.log("Forgot Password response:", response.data);
      toast.success("Email send. Check your email.", {
        duration: 3000,
      });
      toast.dismiss(loadingToastId);
      setForgotPasswordEmail("");
    } catch (error) {
      console.error("Error sending forgot password request:", error);
      if (error.response && error.response.status === 404) {
        toast.error("User not found.", {
          duration: 3000,
        });
      }
      toast.dismiss(loadingToastId);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
            type="email"
            label="Email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className="form-link text-center">
          <>
            <Link
              to="#"
              className="link login text-center cursor-pointer"
              style={{ textDecoration: "underline" }}
              onClick={onOpen}
            >
              Forgot Password?
            </Link>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              placement="top-center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Forgot Password
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        autoFocus
                        label="Email"
                        placeholder="Enter your email"
                        variant="bordered"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        color="primary"
                        onPress={() => {
                          handleForgotPassword();
                        }}
                      >
                        Send
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        </div>
        <ButtonStyle onClick={handleLogin}>Log In</ButtonStyle>

        <div className="form-link p-2 text-center">
          <span>
            Don't have an account?{" "}
            <Link
              href="/signUp"
              className="link login"
              style={{ textDecoration: "underline" }}
            >
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
