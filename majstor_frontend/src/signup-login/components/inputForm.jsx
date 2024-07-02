import React from "react";
import { Input } from "@nextui-org/react";
import PasswordInput from "../components/passwordInput";

const InputForm = ({ onPasswordChange, onInputChange }) => {
  return (
    <div className="input space-y-4">
      <Input
        isRequired
        type="text"
        name="name"
        label="Name"
        placeholder="Name"
        onChange={onInputChange}
      />
      <Input
        isRequired
        type="text"
        name="surname"
        label="Surname"
        placeholder="Surname"
        onChange={onInputChange}
      />
      <Input
        isRequired
        type="email"
        name="mail"
        label="Email"
        placeholder="example@gmail.com"
        onChange={onInputChange}
      />
      <PasswordInput
        label="Password"
        name="password"
        placeholder="Enter your password"
        onPasswordChange={onPasswordChange}
      />
      <Input
        isRequired
        type="text"
        name="phone_number"
        label="Phone"
        placeholder="+387******"
        onChange={onInputChange}
      />
    </div>
  );
};

export default InputForm;
