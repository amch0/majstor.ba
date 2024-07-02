import React, { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "@react-hook/media-query";
import backgroundImage from "../assets/background.jpg";
import InputForm from "./components/inputForm";
import Location from "./components/selectLocation";
import CheckboxUser from "./components/checkbox";
import ButtonStyle from "./components/button";
import { RiImageAddLine } from "react-icons/ri";
import { Link } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const Signup = () => {
  const [image, setImage] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const inputRef = useRef(null);
  const isSmallScreen = useMediaQuery("(max-width: 48em)");
  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    console.log("Selected Location:", value);
  };

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    console.log("Selected Option:", option);
  };

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    mail: "",
    phone_number: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //routing
  const navigate = useNavigate();

  const handlePasswordChange = (newPassword, isPasswordValid) => {
    setIsValidPassword(isPasswordValid);
    console.log("Is password valid?", isPasswordValid);
    setFormData({
      ...formData,
      password: newPassword,
    });
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleSignUp = async () => {
    console.log("SignUp button clicked");

    if (
      !formData.name ||
      !formData.surname ||
      !formData.mail ||
      !formData.phone_number ||
      !isValidPassword ||
      !selectedLocation ||
      !selectedOption
    ) {
      toast.error("Please provide all required fields", {
        duration: 3000,
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      console.log("formDataToSend:", formData.name);

      formDataToSend.append("surname", formData.surname);
      console.log("formDataToSend:", formData.surname);

      formDataToSend.append("mail", formData.mail);
      console.log("formDataToSend:", formData.mail);

      formDataToSend.append("phone_number", formData.phone_number);
      console.log("formDataToSend:", formData.phone_number);

      formDataToSend.append("location", [...selectedLocation]);
      console.log("formDataToSend:", selectedLocation);

      formDataToSend.append("password", formData.password);
      console.log("formDataToSend:", formData.password);

      formDataToSend.append("type", selectedOption);
      console.log("formDataToSend:", selectedOption);

      if (image) {
        formDataToSend.append("profilePicture", image);
      }

      console.log("formDataToSend:", formDataToSend);
      console.log("formData:", formData);
      const loadingToastId = toast.loading("Creating account");
      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      console.log("Response body:", await response.json());

      if (response.ok) {
        console.log("acc crated");
        toast.success(
          "Account created successfully! Please verify your email.",
          {
            duration: 3000,
          }
        );
        toast.dismiss(loadingToastId);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else if (response.status === 409) {
        console.error("Email is already in use");
        toast.error("Email is already in use. Please use a different email.", {
          duration: 3000,
        });
        toast.dismiss(loadingToastId);
      } else {
        console.error("Registration failed");
        toast.error("Registration failed", {
          duration: 3000,
        });
        toast.dismiss(loadingToastId);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed", {
        duration: 3000,
      });
      toast.dismiss(loadingToastId);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className={`h-screen flex items-center justify-center ${
        isSmallScreen ? "" : "bg-cover bg-center bg-no-repeat"
      }`}
      style={
        isSmallScreen ? {} : { backgroundImage: `url(${backgroundImage})` }
      }
    >
      <Toaster richColors position="top-right" />
      <div className="form bg-slate-50 p-8 rounded-lg space-y-4 w-full md:w-4/12 h-3/4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center p-2">Sign Up</h1>

        <div
          onClick={handleImageClick}
          className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center mt-4"
        >
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              className="w-32 h-32 rounded-full mx-auto"
            />
          ) : (
            <RiImageAddLine className="text-gray-600 text-2xl" />
          )}

          <input
            type="file"
            ref={inputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <InputForm
          formData={formData}
          onInputChange={handleInputChange}
          onPasswordChange={handlePasswordChange}
        />
        <Location
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
        />
        <CheckboxUser
          selectedOption={selectedOption}
          onCheckboxChange={handleCheckboxChange}
        />
        <ButtonStyle disabled={!isValidPassword} onClick={handleSignUp}>
          Sign Up
        </ButtonStyle>

        <div className="form-link p-2 text-center">
          <span>
            Don't have an account?{" "}
            <Link
              href="/login"
              className="link signup"
              style={{ textDecoration: "underline" }}
            >
              Log In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
