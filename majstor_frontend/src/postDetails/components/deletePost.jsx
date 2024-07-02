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

const DeletePost = ({ postId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      const loadingToastId = toast.loading("Deleting post");
      await axios.delete(`http://localhost:8080/post/delete-post/${postId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Post deleted.", {
        duration: 1000,
      });

      onClose();
      toast.dismiss(loadingToastId);

      setTimeout(() => {
        window.location.href = "/";
        // window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Button
        className="ml-3 mr-3 mt-8"
        onPress={onOpen}
        color="danger"
        // variant="bordered"
        size="sm"
      >
        Delete Post
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onClose} placement={"top"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete this post?
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
export default DeletePost;
