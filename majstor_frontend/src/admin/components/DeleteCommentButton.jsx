import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { Toaster, toast } from "sonner";

const DeleteCommentButton = ({ postId, commentId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteComment = async () => {
    try {
      const token = localStorage.getItem("token");
      const loadingToastId = toast.loading("Deleting comment");

      if (!token) {
        console.error("Admin token not found.");
        return;
      }

      if (!commentId || !postId) {
        console.error("Invalid user details.");
        return;
      }

      // If the user is an admin, proceed with deleting the post
      await axios.delete(`http://localhost:8080/admin/comment/${commentId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Comment deleted.", {
        duration: 3000,
      });

      onClose();
      toast.dismiss(loadingToastId);

      setTimeout(() => {
        window.location.href = `/admin/post/${postId}`;
      }, 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Button
        className={`mt-5 px-2`}
        style={{ fontSize: "12px" }}
        onPress={onOpen}
        color="danger"
        size="sm"
      >
        Remove
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete a comment?
              </ModalHeader>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  No
                </Button>
                <Button color="danger" onPress={handleDeleteComment}>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteCommentButton;
