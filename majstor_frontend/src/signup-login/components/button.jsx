
import React from "react";
import { Button } from "@nextui-org/react";

const ButtonStyle = ({ children, onClick }) => {
    const handleClick = () => {
        console.log("Button clicked");
        onClick && onClick();
    };

    return (
        <div className="button flex items-center justify-center mt-1">
            <Button color="primary" variant="shadow" onClick={handleClick}>
                {children}
            </Button>
        </div>
    );
};
export default ButtonStyle;
