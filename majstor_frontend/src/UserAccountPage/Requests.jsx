import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Requests = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const navigate = useNavigate();

  const fetchUserRequests = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:8080/request/userRequests",
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      setRequests(response.data.requests);
      setSelectedKeys(
        new Set(
          response.data.requests
            .filter((request) => request.allowed)
            .map((request) => request.request_id.toString())
        )
      );
    } catch (error) {
      console.error("Error fetching requests data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:8080/users/by-token",
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );

        setUser(response.data);

        if (
          response.data.type === "craftsman" ||
          response.data.type === "client"
        ) {
          await fetchUserRequests();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleOpenModal = () => {
    onOpen();
  };

  const handleRowSelect = async (key) => {
    const newSelectedKeys = new Set(selectedKeys);
    const isRowSelected = newSelectedKeys.has(key);

    if (!isRowSelected) {
      newSelectedKeys.add(key);
      setSelectedKeys(newSelectedKeys);

      try {
        const token = localStorage.getItem("token");
        const request_id = key;

        await axios.put(
          "http://localhost:8080/request/update-request-status",
          { request_id, allowed: true },
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );

        await fetchUserRequests();
      } catch (error) {
        console.error("Error updating request status:", error);
      }
    }
  };

  const CraftsmanTable = () => {
    return (
      <Table
        color="success"
        selectionMode="multiple"
        aria-label="Craftsman's table"
        selectedKeys={selectedKeys}
        onSelect={(keys) => setSelectedKeys(keys)}
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    );
  };

  const renderCraftsmanTable = () => {
    return <CraftsmanTable />;
  };

  const renderClientTable = () => {
    const handleRowClick = (postId) => {
      console.log(`Row clicked with post ID: ${postId}`);
      navigate(`/post/${postId}`);
    };

    return (
      <Table color="success" aria-label="Client's table">
        <TableHeader>
          <TableColumn>POST CREATOR NAME</TableColumn>
          <TableColumn>POST CREATOR SURNAME</TableColumn>
          <TableColumn>TITLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.request_id}
              onClick={() => handleRowClick(request.post_id)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{request.post_creator_name}</TableCell>
              <TableCell>{request.post_creator_surname}</TableCell>
              <TableCell>{request.title}</TableCell>
              <TableCell>{request.allowed ? "Approved" : "Pending"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderRows = () => {
    return requests.map((request) => (
      <TableRow
        key={request.request_id}
        selected={selectedKeys.has(request.request_id.toString())}
        onClick={() => handleRowSelect(request.request_id.toString())}
      >
        <TableCell>{`${request.client_name} ${request.client_surname}`}</TableCell>
        <TableCell>{request.title}</TableCell>
        <TableCell>{request.allowed ? "Approved" : "Pending"}</TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <Button
        color="success"
        variant="bordered"
        size="sm"
        className="ml-3"
        onPress={() => {
          handleOpenModal();
        }}
      >
        Requests
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size="5xl"
        placement={"top"}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Your Requests
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              {user && user.type === "craftsman"
                ? renderCraftsmanTable()
                : renderClientTable()}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="bordered" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Requests;
