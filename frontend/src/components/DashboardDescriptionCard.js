import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "../css/common.css";

class DashboardDescriptionCard extends Component {
  constructor(props) {
    super(props);

    this.newQuantity = React.createRef();
    this.state = {
      editMode: false,
    };
  }

  render() {
    return (
      <Card>
        <Card.Header as="h5">
          <Row className="justify-content-between align-items-center">
            <Col className="text-left">Food Pantry Description</Col>
            <Col className="text-right">
              <Button>Edit your description</Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>Veniam amet consectetur labore tempor ea.</Card.Title>
          <Card.Text>
            Ipsum non consectetur ullamco Lorem ad anim est nostrud. Consequat
            ipsum dolore irure sit sint incididunt. Quis aliquip deserunt
            adipisicing adipisicing non veniam non laboris.
          </Card.Text>
          <Button tag="a" href="#" variant="primary">
            link to our site
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default DashboardDescriptionCard;
