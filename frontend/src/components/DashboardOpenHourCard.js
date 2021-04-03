import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "../css/common.css";

class DashboardOpenHourCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const hours = Object.keys(this.props.openHours).map((value, key) => (
      <>
        <Card.Text key={key} className="mb-1">
          day {value}: {this.props.openHours[value].open} -{" "}
          {this.props.openHours[value].close}
        </Card.Text>
      </>
    ));
    return (
      <Card>
        <Card.Header as="h5">
          <Row className="justify-content-between align-items-center">
            <Col className="text-left">Operating Hours</Col>
            <Col className="text-right">
              <Button>Edit your hours</Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            Proident non commodo nostrud cillum ex deserunt.
          </Card.Title>
          <Card.Text>{hours}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default DashboardOpenHourCard;
