import Recommended from "./components/recommended";
import AllPost from "./components/allPosts";
import SearchBar from "./components/searchBar";
import { Row, Col } from "react-bootstrap";

const Home = () => {
  return (
    <div>
      <Row>
        <Col md={12} style={{ marginBottom: "20px" }}>
          <SearchBar />
        </Col>
      </Row>
      <Row>
        <Col md={4} style={{ marginBottom: "20px" }}>
          <Recommended />
        </Col>
        <Col md={8}>
          <AllPost />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
