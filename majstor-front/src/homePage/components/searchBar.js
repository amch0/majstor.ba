import React, { useState, useEffect } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import axios from "axios";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useState({ name: "", surname: "" });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchParams.name || searchParams.surname) {
        try {
          const response = await axios.get(
            `http://localhost:8080/users?page=1&pageSize=100&name=${searchParams.name}&surname=${searchParams.surname}`
          );
          setUsers(response.data); // Make sure to adjust this based on the actual response structure
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      } else {
        // If both name and surname are empty, reset the users array
        setUsers([]);
      }
    };

    const timerId = setTimeout(() => fetchData(), 500);

    return () => clearTimeout(timerId);
  }, [searchParams]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Check if the input is empty
    if (inputValue.trim() === "") {
      // If empty, reset the searchParams and users array
      setSearchParams({ name: "", surname: "" });
      setUsers([]);
    } else {
      const lastSpaceIndex = inputValue.lastIndexOf(" ");

      if (lastSpaceIndex !== -1) {
        setSearchParams({
          name: inputValue.substring(0, lastSpaceIndex).trim(),
          surname: inputValue.substring(lastSpaceIndex + 1).trim(),
        });
      } else {
        setSearchParams({ name: inputValue.trim(), surname: "" });
      }
    }
  };

  return (
    <Container>
      <Form>
        <Row className="mb-4">
          <Col md={12}>
            <Form.Control
              type="text"
              placeholder="Name and Surname"
              value={`${searchParams.name} ${searchParams.surname}`}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
      </Form>
      {/* Only render the users if there are users to display */}
      {users.length > 0 && (
        <Row>
          {users.map((user) => (
            <Col key={user.id} md={4} className="user-card">
              <div className="user-info">
                <img
                  src={user.profile_picture}
                  alt={`${user.name} ${user.surname}`}
                  className="user-image"
                />
                <div className="name">{user.name}</div>
                <div className="surname">{user.surname}</div>
                <div className="type">{user.type}</div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SearchBar;
