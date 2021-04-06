import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { toast } from "react-toastify";
import PantryService from "../services/pantry.service";

import "../css/common.css";

class DashboardDescriptionCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // used by switch case in 'editMode'
      editMode4Detail: false,
      editMode4Address: false,
      editMode4Zipcode: false,
      editMode4City: false,
      editMode4State: false,
      editMode4Phone: false,
      editMode4Weblink: false,
      pantry_id: 1, // TODO: change this to actual pantryID
    };

    // used by switch case in 'showEditButton'
    this.onClickUpdateDetail = this.onClickUpdateDetail.bind(this);
    this.onClickUpdateAddress = this.onClickUpdateAddress.bind(this);
    this.onClickUpdateZipcode = this.onClickUpdateZipcode.bind(this);
    this.onClickUpdateCity = this.onClickUpdateCity.bind(this);
    this.onClickUpdateState = this.onClickUpdateState.bind(this);
    this.onClickUpdatePhone = this.onClickUpdatePhone.bind(this);
    this.onClickUpdateWeblink = this.onClickUpdateWeblink.bind(this);
  }

  editMode(params, On) {
    switch (params) {
      case "description":
        this.setState({
          editMode4Detail: On ? true : false,
        });
        break;
      case "address":
        this.setState({
          editMode4Address: On ? true : false,
        });
        break;
      case "zipcode":
        this.setState({
          editMode4Zipcode: On ? true : false,
        });
        break;
      case "city":
        this.setState({
          editMode4City: On ? true : false,
        });
        break;
      case "state":
        this.setState({
          editMode4State: On ? true : false,
        });
        break;
      case "phone":
        this.setState({
          editMode4Phone: On ? true : false,
        });
        break;
      case "weblink":
        this.setState({
          editMode4Weblink: On ? true : false,
        });
        break;
      default:
        console.log("Error hehe~~EditMode");
    }
  }

  /**
   * Ask for confirmation and update the item's quantity.
   *
   */
  onClickUpdateDetail() {
    let description = this.props.description;

    if (window.confirm("Are you sure you want to update ?")) {
      PantryService.updatePantryDetail(this.state.pantry_id, description)
        .then(() => {
          toast.success("Description was successfully updated!");
          this.editMode("description", false);
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  onClickUpdateAddress() {
    let address = this.props.address;
    if (window.confirm("Are you sure you want to update ?")) {
      PantryService.updatePantryAddress(this.state.pantry_id, address)
        .then(() => {
          toast.success("Description was successfully updated!");
          this.editMode("address", false);
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  onClickUpdateZipcode() {
    let zipcode = this.props.zipcode;
    if (window.confirm("Are you sure you want to update ?")) {
      PantryService.updatePantryZipcode(this.state.pantry_id, zipcode)
        .then(() => {
          toast.success("Description was successfully updated!");
          this.editMode("zipcode", false);
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  onClickUpdateCity() {
    let city = this.props.city;
    if (window.confirm("Are you sure you want to update ?")) {
      PantryService.updatePantryCity(this.state.pantry_id, city)
        .then(() => {
          toast.success("Description was successfully updated!");
          this.editMode("city", false);
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  onClickUpdateState() {
    let stte = this.props.stte;
    if (window.confirm("Are you sure you want to update ?")) {
      PantryService.updatePantryState(this.state.pantry_id, stte)
        .then(() => {
          toast.success("Description was successfully updated!");
          this.editMode("state", false);
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  onClickUpdatePhone() {
    let phone = this.props.phone;
    if (window.confirm("Are you sure you want to update ?")) {
      PantryService.updatePantryPhoneNumber(this.state.pantry_id, phone)
        .then(() => {
          toast.success("Description was successfully updated!");
          this.editMode("phone", false);
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  onClickUpdateWeblink() {
    let weblink = this.props.weblink;
    if (window.confirm("Are you sure you want to update ?")) {
      PantryService.updatePantryWebsite(this.state.pantry_id, weblink)
        .then(() => {
          toast.success("Description was successfully updated!");
          this.editMode("weblink", false);
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  showEditButton(params) {
    let edit = null;
    let onClickUpdate = null;
    switch (params) {
      case "description":
        edit = this.state.editMode4Detail;
        onClickUpdate = this.onClickUpdateDetail;
        break;

      case "address":
        edit = this.state.editMode4Address;
        onClickUpdate = this.onClickUpdateAddress;
        break;

      case "zipcode":
        edit = this.state.editMode4Zipcode;
        onClickUpdate = this.onClickUpdateZipcode;
        break;

      case "city":
        edit = this.state.editMode4City;
        onClickUpdate = this.onClickUpdateCity;
        break;

      case "state":
        edit = this.state.editMode4State;
        onClickUpdate = this.onClickUpdateState;
        break;

      case "phone":
        edit = this.state.editMode4Phone;
        onClickUpdate = this.onClickUpdatePhone;
        break;

      case "weblink":
        edit = this.state.editMode4Weblink;
        onClickUpdate = this.onClickUpdateWeblink;
        break;
    }
    if (edit) {
      return (
        <Row>
          <Col>
            <Button onClick={onClickUpdate} size="sm">
              Update
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                this.editMode(params, false);
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      );
    } else {
      return (
        <Button
          variant="outline-dark"
          onClick={() => {
            this.editMode(params, true);
          }}
        >
          Edit
        </Button>
      );
    }
  }

  render() {
    return (
      <Card bg="light" className="w-responsive w-75 text-center mx-auto mt-2">
        <Card.Header as="h5">
          <Row className="justify-content-between align-items-center">
            <Col className="text-left">Food Pantry Description</Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>{this.props.pantryName}</Card.Title>
          <hr />
          <Card.Text>
            <Row className="align-items-center m-2">
              <Col className="text-left" xs={9}>
                <Form>
                  <Form.Group controlId="formDescription">
                    <Form.Label>
                      <strong>- description: </strong>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      disabled={!this.state.editMode4Detail}
                      defaultValue={this.props.description}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={3}>{this.showEditButton("description")}</Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left" xs={9}>
                <Form>
                  <Form.Group controlId="formAddress">
                    <Form.Label>
                      <strong>- address: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!this.state.editMode4Address}
                      defaultValue={this.props.address}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={3}>{this.showEditButton("address")}</Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left" xs={9}>
                <Form>
                  <Form.Group controlId="formZipcode">
                    <Form.Label>
                      <strong>- zipcode: </strong>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      disabled={!this.state.editMode4Zipcode}
                      defaultValue={this.props.zipcode}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={3}>{this.showEditButton("zipcode")}</Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left" xs={9}>
                <Form>
                  <Form.Group controlId="formCity">
                    <Form.Label>
                      <strong>- city: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!this.state.editMode4City}
                      defaultValue={this.props.city}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={3}>{this.showEditButton("city")}</Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left" xs={9}>
                <Form>
                  <Form.Group controlId="formState">
                    <Form.Label>
                      <strong>- state: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!this.state.editMode4State}
                      defaultValue={this.props.stte}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={3}>{this.showEditButton("state")}</Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left" xs={9}>
                <Form>
                  <Form.Group controlId="formPhone">
                    <Form.Label>
                      <strong>- phone number: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!this.state.editMode4Phone}
                      defaultValue={this.props.phone}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={3}>{this.showEditButton("phone")}</Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left" xs={9}>
                <Form>
                  <Form.Group controlId="formWeblink">
                    <Form.Label>
                      <strong>- weblink: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      disabled={!this.state.editMode4Weblink}
                      defaultValue={this.props.weblink}
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col xs={3}>{this.showEditButton("weblink")}</Col>
            </Row>
          </Card.Text>
          {/* 
          open window in new tab 
          reference: 
          https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react 
          */}
          <Row className="m-2">
            <Col className="text-left">
              <Button
                tag="a"
                onClick={() => window.open(this.props.weblink, "_blank")}
                variant="outline-dark"
              >
                link to <em>{this.props.pantryName}</em>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default DashboardDescriptionCard;
