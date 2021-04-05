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
              <Button>Edit your pantry description</Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>{this.props.pantryName}</Card.Title>
          <Card.Text>
            <strong>- description: </strong>
            {this.props.description} <br />
            <strong>- address: </strong>
            {this.props.address} <br />
            <strong>- zip code: </strong>
            {this.props.zipcode} <br />
            <strong>- city: </strong>
            {this.props.city} <br />
            <strong>- state: </strong>
            {this.props.stte} <br />
            <strong>- phone number: </strong>
            {this.props.phone} <br />
            <strong>- weblink: </strong>
            {this.props.weblink} <br />
          </Card.Text>
          <Button
            tag="a"
            // reference:
            // https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react
            onClick={() => window.open(this.props.weblink, "_blank")}
            variant="primary"
          >
            link to our site
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default DashboardDescriptionCard;
