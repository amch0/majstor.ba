import React from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const DeleteComment = ({ commentId }) => {
  const handleDeleteRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:8080/comment/${commentId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      toast.success("Comment has been send successfully!", {
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
      color="danger"
      size="sm"
      onClick={handleDeleteRequest}
    >
      Delete
    </Button>
  );
};
export default DeleteComment;
