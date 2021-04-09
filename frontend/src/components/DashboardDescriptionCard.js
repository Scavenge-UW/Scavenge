import React, { Component } from "react";

// import for bootstrap
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// import for services
import PantryService from "../services/pantry.service";

// other imports
import { toast } from "react-toastify";
import "../css/common.css";

class DashboardDescriptionCard extends Component {
  constructor(props) {
    super(props);

    this.newDetail = React.createRef();
    this.newAddress = React.createRef();
    this.newZipcode = React.createRef();
    this.newCity = React.createRef();
    this.newStte = React.createRef();
    this.newPhone = React.createRef();
    this.newWeblink = React.createRef();

    this.state = {
      // used by in 'editModeControl'
      editMode: false,
    };
  }

  /**
   * Allows admins to enter/exit editMode.
   *
   * @param {*} On if On, activate editMode;
   *               if not On, deactivate editMode and discard the changes.
   */
  editModeControl(On) {
    this.setState({
      editMode: On ? true : false,
    });
    // upon exiting editMode, discard changes
    if (!On) {
      this.newDetail.current.value = this.props.description;
      this.newAddress.current.value = this.props.address;
      this.newZipcode.current.value = this.props.zipcode;
      this.newCity.current.value = this.props.city;
      this.newStte.current.value = this.props.stte;
      this.newPhone.current.value = this.props.phone;
      this.newWeblink.current.value = this.props.weblink;
    }
  }

  /**
   * Ask for confirmation and update the pantry's info.
   *
   */
  onClickUpdatePantryInfo() {
    let pid = this.props.pantry_id;

    if (
      window.confirm(
        "Are you sure you want to make these updates on your pantry information?"
      )
    ) {
      PantryService.updatePantryInfo(pid, {
        name: this.props.pantryName, // TODO: this shouldn't be updated
        address: this.newAddress.current.value,
        zip: this.newZipcode.current.value,
        city: this.newCity.current.value,
        state: this.newStte.current.value,
        phone_number: this.newPhone.current.value,
        details: this.newDetail.current.value,
        img_src: this.props.img_src, // TODO: this shouldn't be updated
        lat: this.props.lat, // TODO: this shouldn't be updated
        lon: this.props.lon, // TODO: this shouldn't be updated
        website: this.newWeblink.current.value,
      })
        .then(() => {
          // propogate updates back to parent component
          this.props.updateAllDetails([
            this.newDetail.current.value,
            this.newAddress.current.value,
            this.newZipcode.current.value,
            this.newCity.current.value,
            this.newStte.current.value,
            this.newPhone.current.value,
            this.newWeblink.current.value,
          ]);

          this.editModeControl(false);
          toast.success("Pantry Info was successfully updated!");
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  editButtonControl() {
    if (this.state.editMode) {
      return (
        <Row>
          <Col>
            <Button onClick={this.onClickUpdatePantryInfo.bind(this)} size="sm">
              Update
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                this.editModeControl(false);
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
          adminMode
          variant="outline-dark"
          onClick={() => {
            this.editModeControl(true);
          }}
        >
          Edit Pantry Info
        </Button>
      );
    }
  }

  render() {
    return (
      <Card bg="light" className="w-responsive w-75 text-center mx-auto mt-2">
        <Card.Header as="h5">
          <Row className="justify-content-between align-items-center">
            <Col xs={9} className="text-left">
              Food Pantry Description
            </Col>
            <Col xs={3}>{this.editButtonControl()}</Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title>{this.props.pantryName}</Card.Title>
          <hr />
          <Card.Text>
            <Row className="align-items-center m-2">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formDescription">
                    <Form.Label>
                      <strong>- description: </strong>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      ref={this.newDetail}
                      disabled={!this.state.editMode}
                      defaultValue={this.props.description}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formAddress">
                    <Form.Label>
                      <strong>- address: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      ref={this.newAddress}
                      disabled={!this.state.editMode}
                      defaultValue={this.props.address}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formZipcode">
                    <Form.Label>
                      <strong>- zipcode: </strong>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      ref={this.newZipcode}
                      disabled={!this.state.editMode}
                      defaultValue={this.props.zipcode}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formCity">
                    <Form.Label>
                      <strong>- city: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      ref={this.newCity}
                      disabled={!this.state.editMode}
                      defaultValue={this.props.city}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formState">
                    <Form.Label>
                      <strong>- state: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      ref={this.newStte}
                      disabled={!this.state.editMode}
                      defaultValue={this.props.stte}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formPhone">
                    <Form.Label>
                      <strong>- phone number: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      ref={this.newPhone}
                      disabled={!this.state.editMode}
                      defaultValue={this.props.phone}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formWeblink">
                    <Form.Label>
                      <strong>- weblink: </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      ref={this.newWeblink}
                      disabled={!this.state.editMode}
                      defaultValue={this.props.weblink}
                    />
                  </Form.Group>
                </Form>
              </Col>
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
