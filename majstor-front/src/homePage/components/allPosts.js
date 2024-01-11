import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col } from "react-bootstrap";

const AllPost = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch data from the provided endpoint
    axios
      .get("http://localhost:8080/post/?pageSize=100&page=1")
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Run the effect only once when the component mounts

  return (
    <Container>
      <h3>All Posts</h3>
      <Row>
        {posts.map((post) => (
          <Col key={post.post_id} md={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={`http://localhost:8080${post.work_pictures[0]}`}
              />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                {/* You can add more details here if needed */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllPost;
