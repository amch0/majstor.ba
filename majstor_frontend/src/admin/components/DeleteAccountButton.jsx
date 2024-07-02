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

const DeleteAccountButton = ({ userDetails }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const loadingToastId = toast.loading("Deleting account");

      if (!token) {
        console.error("Admin token not found.");
        return;
      }

      if (!userDetails || !userDetails.id) {
        console.error("Invalid user details.");
        return;
      }

      await axios.delete(`http://localhost:8080/admin/${userDetails.id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      toast.success("Account deleted.", {
        duration: 3000,
      });

      onClose();
      toast.dismiss(loadingToastId);

      setTimeout(() => {
        console.log("Redirecting to /homeadmin...");
        window.location.href = "/homeadmin";
      }, 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <Button
        className="mr-3 mt-3"
        onPress={onOpen}
        color="danger"
        // variant="bordered"
        size="sm"
      >
        Delete Account
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete an account?
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
export default DeleteAccountButton;
