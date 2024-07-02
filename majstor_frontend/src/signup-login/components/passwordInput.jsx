import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Input } from "@nextui-org/react";

const PasswordInput = ({ label, placeholder, onPasswordChange }) => {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    const isLengthValid = newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const isPasswordValid = isLengthValid && hasUpperCase;

    setPassword(newPassword);
    onPasswordChange(newPassword, isPasswordValid);
  };

  return (
    <Input
      isRequired
      label={label}
      placeholder={placeholder}
      onChange={handlePasswordChange}
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
  );
};

export default PasswordInput;
