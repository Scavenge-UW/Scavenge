import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

class CartView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <h1 className="view-header text-center mb-3">Cart</h1>
        <Row className="justify-content-between align-items-center">
          <Col>
            <h2>hello</h2>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CartView;
