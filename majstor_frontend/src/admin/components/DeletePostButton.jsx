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

const DeletePostButton = ({ postId, userId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      const loadingToastId = toast.loading("Deleting account");

      if (!token) {
        console.error("Admin token not found.");
        return;
      }

      if (!postId) {
        console.error("Invalid user details.");
        return;
      }

      // If the user is an admin, proceed with deleting the post
      await axios.delete(`http://localhost:8080/admin/post/${postId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Post deleted.", {
        duration: 3000,
      });

      onClose();
      toast.dismiss(loadingToastId);

      setTimeout(() => {
        window.location.href = `/admin/userId/${userId}`;
      }, 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Button onPress={onOpen} color="danger">
        Delete Post
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete a post?
              </ModalHeader>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  No
                </Button>
                <Button color="danger" onPress={handleDeletePost}>
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

export default DeletePostButton;
