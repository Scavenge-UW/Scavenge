import React, { Component } from "react";

// import for bootstrap
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// import for services
import PantryService from "../../services/pantry.service";

// other imports
import "../../css/common.css";
import { toast } from "react-toastify";
import ddtooltip from "../helper_functions/DashboardDescriptionTooltip";

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
    this.newImgSrc = React.createRef();
    this.newTimeToAdd = React.createRef();

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
      this.newImgSrc = this.props.img_src;
      this.newTimeToAdd = this.props.time_to_add;
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
        name: this.props.pantryName, // remain unchanged
        address: this.newAddress.current.value,
        zip: this.newZipcode.current.value,
        city: this.newCity.current.value,
        state: this.newStte.current.value,
        phone_number: this.newPhone.current.value,
        details: this.newDetail.current.value,
        img_src: this.props.img_src,
        lat: this.props.lat, // remain unchanged
        lon: this.props.lon, // remain unchanged
        website: this.newWeblink.current.value,
        time_to_add: this.newTimeToAdd.current.value,
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
            this.props.img_src,
            this.newImgSrc.current.value,
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
                      <strong>
                        - Description: {ddtooltip.getTooltip("description")}
                      </strong>
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
                      <strong>
                        - Address: {ddtooltip.getTooltip("address")}
                      </strong>
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
                      <strong>
                        - Zipcode: {ddtooltip.getTooltip("zipcode")}
                      </strong>
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
                      <strong>- City: {ddtooltip.getTooltip("city")}</strong>
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
                      <strong>- State: {ddtooltip.getTooltip("state")}</strong>
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
                      <strong>
                        - Phone number: {ddtooltip.getTooltip("phone")}
                      </strong>
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
                      <strong>
                        - Weblink: {ddtooltip.getTooltip("weblink")}
                      </strong>
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
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formImgSrc">
                    <Form.Label>
                      <strong>
                        - Image Source: {ddtooltip.getTooltip("img_src")}
                      </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      ref={this.newImgSrc}
                      disabled={true} // not yet implemented
                      defaultValue={this.props.img_src}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
            <Row className="align-items-center m-2" md="auto">
              <Col className="text-left">
                <Form>
                  <Form.Group controlId="formTimeTOAdd">
                    <Form.Label>
                      <strong>
                        - Time To Add (in minutes):{" "}
                        {ddtooltip.getTooltip("time_to_add")}
                      </strong>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      ref={this.newTimeToAdd}
                      disabled={!this.state.editMode}
                      defaultValue={this.props.time_to_add}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Card.Text>
          {/* 
          // link to the website button (not wanted but saved for later used)
          open window in new tab 
          reference: 
          https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react 
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
          */}
        </Card.Body>
      </Card>
    );
  }
}

export default DashboardDescriptionCard;
