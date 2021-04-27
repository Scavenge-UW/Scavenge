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
      <Container id="home-view">
        <Row className="justify-content-center mt-2">
          <h1>Welcome to Scavenge</h1>
        </Row>
        <hr />
        <Row className="justify-content-center mb-3">
          <Col id="list-view">
            <ListView />
          </Col>
        </Row>
        <Row>
          <Col id="map-view">
            <Map />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default HomeView;
