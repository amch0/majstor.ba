import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Col, Row } from "react-bootstrap";
import "./recommended.css";
import alternativeImage from "../../images/alternativaUser.png";

const Recommended = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_RECOMMENDED_USERS}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Recommended craftsman</h3>
      <div className="user-cards">
        {users.map((user) => (
          <Card key={user.id} className="my-2">
            <Row>
              <Col
                md={3}
                className="d-flex align-items-center justify-content-center"
              >
                <Card.Img
                  variant="top"
                  src={
                    user.profile_picture
                      ? `http://localhost:8080${user.profile_picture}`
                      : alternativeImage
                  }
                  className="rounded-circle user-img"
                />
              </Col>
              <Col md={9}>
                <Card.Title className="mt-2 text-center">
                  {`${user.name} ${user.surname}`}
                </Card.Title>
                <Card.Body className="text-center">
                  <div className="user-info">
                    <strong>Location:</strong> {user.location}
                  </div>
                  <div className="user-info">
                    <strong>Rating:</strong> {user.rating}
                  </div>
                  <Button variant="primary" className="mt-2">
                    See more
                  </Button>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Recommended;
