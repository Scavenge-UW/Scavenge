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
      editMode4Detail: false,
      editMode4Address: false,
      editMode4Zipcode: false,
      editMode4City: false,
      editMode4State: false,
      editMode4Phone: false,
      editMode4Weblink: false,
      pantry_id: 1, // TODO: change this to actual pantryID
    };
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

    // if (window.confirm("Are you sure you want to update ?")) {
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
    // }
  }

  onClickUpdateAddress() {
    let address = this.props.address;
    // if (window.confirm("Are you sure you want to update ?")) {
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
    // }
  }

  onClickUpdateZipcode() {
    let zipcode = this.props.zipcode;
    // if (window.confirm("Are you sure you want to update ?")) {
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
    // }
  }

  onClickUpdateCity() {
    let city = this.props.city;
    // if (window.confirm("Are you sure you want to update ?")) {
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
    // }
  }

  onClickUpdateState() {
    let stte = this.props.stte;
    // if (window.confirm("Are you sure you want to update ?")) {
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
    // }
  }

  onClickUpdatePhone() {
    let phone = this.props.phone;
    // if (window.confirm("Are you sure you want to update ?")) {
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
    // }
  }

  onClickUpdateWeblink() {
    let weblink = this.props.weblink;
    // if (window.confirm("Are you sure you want to update ?")) {
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
    // }
  }

  showEditButton(params) {
    switch (params) {
      case "description":
        if (this.state.editMode4Detail) {
          return (
            <Row>
              <Col>
                <Button block onClick={this.onClickUpdateDetail}>
                  Update
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  onClick={() => {
                    this.editMode("description", false);
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
              block
              variant="outline-primary"
              onClick={() => {
                this.editMode("description", true);
              }}
            >
              Edit
            </Button>
          );
        }
      case "address":
        if (this.state.editMode4Address) {
          return (
            <Row>
              <Col>
                <Button block onClick={this.onClickUpdateAddress}>
                  Update
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  onClick={() => {
                    this.editMode("address", false);
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
              block
              variant="outline-primary"
              onClick={() => {
                this.editMode("address", true);
              }}
            >
              Edit
            </Button>
          );
        }
      case "zipcode":
        if (this.state.editMode4Zipcode) {
          return (
            <Row>
              <Col>
                <Button block onClick={this.onClickUpdateZipcode}>
                  Update
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  onClick={() => {
                    this.editMode("zipcode", false);
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
              block
              variant="outline-primary"
              onClick={() => {
                this.editMode("zipcode", true);
              }}
            >
              Edit
            </Button>
          );
        }
      case "city":
        if (this.state.editMode4City) {
          return (
            <Row>
              <Col>
                <Button block onClick={this.onClickUpdateCity}>
                  Update
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  onClick={() => {
                    this.editMode("city", false);
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
              block
              variant="outline-primary"
              onClick={() => {
                this.editMode("city", true);
              }}
            >
              Edit
            </Button>
          );
        }
      case "state":
        if (this.state.editMode4State) {
          return (
            <Row>
              <Col>
                <Button block onClick={this.onClickUpdateState}>
                  Update
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  onClick={() => {
                    this.editMode("state", false);
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
              block
              variant="outline-primary"
              onClick={() => {
                this.editMode("state", true);
              }}
            >
              Edit
            </Button>
          );
        }
      case "phone":
        if (this.state.editMode4Phone) {
          return (
            <Row>
              <Col>
                <Button block onClick={this.onClickUpdatePhone}>
                  Update
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  onClick={() => {
                    this.editMode("phone", false);
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
              block
              variant="outline-primary"
              onClick={() => {
                this.editMode("phone", true);
              }}
            >
              Edit
            </Button>
          );
        }
      case "weblink":
        if (this.state.editMode4Weblink) {
          return (
            <Row>
              <Col>
                <Button block onClick={this.onClickUpdateWeblink}>
                  Update
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  onClick={() => {
                    this.editMode("weblink", false);
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
              block
              variant="outline-primary"
              onClick={() => {
                this.editMode("weblink", true);
              }}
            >
              Edit
            </Button>
          );
        }
      default:
        console.log("Error hehe~~ShowEditButton");
    }
  }

  render() {
    return (
      <Card>
        <Card.Header as="h5">
          <Row className="justify-content-between align-items-center">
            <Col className="text-left">Food Pantry Description</Col>
            {/* <Col className="text-right">{this.showEditDescriptionButton()}</Col> */}
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>{this.props.pantryName}</Card.Title>
          <Card.Text>
            <Row
              className="justify-content-between align-items-center m-2"
              md="auto"
            >
              <Col>
                <strong>- description: </strong>
                {this.props.description}
              </Col>
              <Col>{this.showEditButton("description")}</Col>
            </Row>
            <Row
              className="justify-content-between align-items-center m-2"
              md="auto"
            >
              <Col>
                <strong>- address: </strong>
                {this.props.address}
              </Col>
              <Col>{this.showEditButton("address")}</Col>
            </Row>
            <Row
              className="justify-content-between align-items-center m-2"
              md="auto"
            >
              <Col>
                <strong>- zip code: </strong>
                {this.props.zipcode}
              </Col>
              <Col>{this.showEditButton("zipcode")}</Col>
            </Row>
            <Row
              className="justify-content-between align-items-center m-2"
              md="auto"
            >
              <Col>
                <strong>- city: </strong>
                {this.props.city} <br />
              </Col>
              <Col>{this.showEditButton("city")}</Col>
            </Row>
            <Row
              className="justify-content-between align-items-center m-2"
              md="auto"
            >
              <Col>
                <strong>- state: </strong>
                {this.props.stte}
              </Col>
              <Col>{this.showEditButton("state")}</Col>
            </Row>
            <Row
              className="justify-content-between align-items-center m-2"
              md="auto"
            >
              <Col>
                <strong>- phone number: </strong>
                {this.props.phone}
              </Col>
              <Col>{this.showEditButton("phone")}</Col>
            </Row>
            <Row
              className="justify-content-between align-items-center m-2"
              md="auto"
            >
              <Col>
                <strong>- weblink: </strong>
                {this.props.weblink}
              </Col>
              <Col>{this.showEditButton("weblink")}</Col>
            </Row>
          </Card.Text>
          <Button
            tag="a"
            // open window in new tab
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
