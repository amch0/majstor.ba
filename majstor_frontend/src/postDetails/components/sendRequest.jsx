import React from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const SendRequest = ({ postId }) => {
  const handleSendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/request/",
        {
          post_id: postId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.success("Request has been send successfully!", {
        duration: 2000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };
  return (
    <Button
      type="button"
      color="secondary"
      className=" mb-4"
      onClick={handleSendRequest}
    >
      Send Request
    </Button>
  );
};
export default SendRequest;
