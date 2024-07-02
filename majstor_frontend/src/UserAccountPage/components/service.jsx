import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

const Service = ({ onServiceChange, selectedService }) => {
  const handleServiceChange = (value) => {
    console.log("Inside handleServiceChange:", value);
    onServiceChange(value);
  };

  const serviceOptions = [
    { value: "Painter", label: "Painter" },
    { value: "Plumber", label: "Plumber" },
    { value: "Cleaning", label: "Cleaning" },
    { value: "Mechanic", label: "Mechanic" },
    { value: "Ceramist", label: "Ceramist" },
    { value: "Electrician", label: "Electrician" },
    { value: "Builder", label: "Builder" },
    { value: "Heating", label: "Heating" },
    { value: "PVC", label: "PVC" },
    { value: "Joinery", label: "Joinery" },
  ];

  return (
    <div className="location">
      <Select
        className="service-select" //dodano?
        placeholder="Select service"
        onSelectionChange={handleServiceChange}
        value={selectedService}
        items={serviceOptions}
      >
        {(loc) => <SelectItem key={loc.value}>{loc.label}</SelectItem>}
      </Select>
    </div>
  );
};

export default Service;
