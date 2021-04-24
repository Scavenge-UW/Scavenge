import React, { Component } from "react";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

// imports for components
import Map from "./Map.js";
import ListView from "./ListView.js";

// other imports
import img from "../../images/home.jpg";

class HomeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <h1 className="view-header text-center mb-3">Welcome to Scavenge</h1>
        <Row className="justify-content-between align-items-center">
          <Row>
            <Col md={4} className="pr-1">
              <ListView />
            </Col>
            <Col md={8} className="p-0 mt-4">
              <Map />
            </Col>
          </Row>
        </Row>
      </Container>
    );
  }
}

export default HomeView;
