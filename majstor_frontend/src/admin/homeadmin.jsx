import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../admin/components/SearchBar";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const HomeAdmin = () => {
  const [users, setUsers] = useState([]);
  const [adminToken, setAdminToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokenAndUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/loginadmin");
          return;
        }

        const tokenResponse = await axios.get(
          "http://localhost:8080/users/by-token",
          {
            headers: { Authorization: `${token}` },
          }
        );

        if (tokenResponse.data.type !== "admin") {
          navigate("/");
          return;
        }

        setAdminToken(tokenResponse.data);

        const usersResponse = await axios.get(
          "http://localhost:8080/admin/loginSession?page=1&pageSize=30",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (Array.isArray(usersResponse.data.loginSessions)) {
          setUsers(usersResponse.data.loginSessions);
        } else {
          console.error("Received data is not an array:", usersResponse.data);
        }
      } catch (error) {
        console.error("Error fetching token or users", error);
      }
    };

    fetchTokenAndUsers();
  }, [navigate]);

  useEffect(() => {
    if (adminToken && adminToken.type !== "admin") {
      navigate("/");
    }
  }, [adminToken, navigate]);

  const handleRowClick = (user) => {
    const userId = user.user_id;
    console.log("Navigating to:", `/admin/userId/${userId}`);
    navigate(`/admin/userId/${userId}`);
  };

  const [selectedColor, setSelectedColor] = React.useState("warning");

  return (
    <div className="p-6 md:p-0 h-screen">
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="lg:w-1/3 lg:pr-4">
          <SearchBar />
        </div>
        <div
          className="mt-10 text-center p-10"
          style={{ width: "80%", overflowX: "auto", maxHeight: "400px" }}
        >
          <Table
            aria-label="Users table"
            className="mt-5"
            color={selectedColor}
            selectionMode="single"
          >
            <TableHeader>
              <TableColumn className="mt-10 text-center">NAME</TableColumn>
              <TableColumn className="mt-10 text-center">SURNAME</TableColumn>
              <TableColumn className="mt-10 text-center">EMAIL</TableColumn>
              <TableColumn className="text-center">TYPE</TableColumn>
              <TableColumn className="mt-10 text-center">TIME</TableColumn>
            </TableHeader>
            <TableBody>
              {Array.isArray(users) &&
                users.map((user) => (
                  <TableRow
                    key={user.session_id}
                    onClick={() => handleRowClick(user)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell> {user.name} </TableCell>
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.user_type}</TableCell>
                    <TableCell>
                      {new Date(user.login_time).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
