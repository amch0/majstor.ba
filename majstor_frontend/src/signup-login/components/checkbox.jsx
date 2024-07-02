import React, { useState } from "react";
import { Checkbox } from "@nextui-org/react";

const CheckboxUser = ({ onCheckboxChange, selectedOption }) => {
  const handleCheckboxChange = (option) => {
    if (onCheckboxChange) {
      onCheckboxChange(option);
    }
  };

  return (
    <div className="checkbox flex flex-col">
      <span className="text-gray-500 mt-2">Select...</span>

      <Checkbox
        isSelected={selectedOption === "client"}
        onValueChange={() => handleCheckboxChange("client")}
        className="ml-2 mt-1"
      >
        Client
      </Checkbox>

      <Checkbox
        isSelected={selectedOption === "craftsman"}
        onValueChange={() => handleCheckboxChange("craftsman")}
        className="ml-2 mt-1"
      >
        Craftsmen
      </Checkbox>
    </div>
  );
};
export default CheckboxUser;
