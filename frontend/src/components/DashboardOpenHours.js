import React, { Component } from "react";

// import for bootstrap
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// import for component
import DashboardOpenHourCard from "./DashboardOpenHourCard";

import "../css/common.css";

class DashboardOpenHours extends Component {
  constructor(props) {
    super(props);
  }

  /**
   *
   * @returns rendered components
   */
  render() {
    return (
      <Card bg="light" className="w-responsive w-75 text-center mx-auto mt-2">
        <Card.Header as="h5">
          <Row className="justify-content-between align-items-center">
            <Col className="text-left">Operating Hours</Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>{this.props.pantryName}</Card.Title>
          <hr />
          <Row className="w-responsive w-100">
            {this.props.hours.map((item) => (
              <DashboardOpenHourCard
                adminMode
                pantry_id={this.props.pantry_id}
                day={item.day}
                open={item.open}
                close={item.close}
                detail={item.detail}
                updateOpenHours={this.props.updateOpenHours}
                key={item.day.toString()}
              />
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default DashboardOpenHours;
