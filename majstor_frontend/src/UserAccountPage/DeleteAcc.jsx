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

const DeleteAcc = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const loadingToastId = toast.loading("Deleting account");
      await axios.delete("http://localhost:8080/users", {
        headers: {
          Authorization: `${token}`,
        },
      });
      toast.success("Account deleted.", {
        duration: 3000,
      });
      localStorage.removeItem("token");

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
      <Toaster richColors position="top-right" />
      <Button
        className="ml-3 mr-3"
        onPress={onOpen}
        color="danger"
        // variant="bordered"
        size="sm"
      >
        Delete Account
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onClose} placement={"top"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete your account?
              </ModalHeader>

              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  No
                </Button>
                <Button color="danger" onPress={handleDeleteAccount}>
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
export default DeleteAcc;
