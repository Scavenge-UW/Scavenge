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
import formatters from "./formatters/DatetimeFormatter";

class DashboardOpenHourCard extends Component {
  constructor(props) {
    super(props);

    this.newOpen = React.createRef();
    this.newClose = React.createRef();
    this.newDetail = React.createRef();

    this.state = {
      // used by editModeControl to enter/exit editMode
      editMode: false,
    };
  }

  /**
   * Allows admins to enter/exit editMode.
   *
   * @param {*} On if On, activate editMode; if not On, deactivate editMode and discard the changes.
   */
  editModeControl(On) {
    this.setState({
      editMode: On ? true : false,
    });
    // upon exiting editMode, discard changes
    if (!On) {
      this.newOpen.current.value = this.props.open;
      this.newClose.current.value = this.props.close;
      this.newDetail.current.value = this.props.detail;
    }
  }

  /**
   * Ask for confirmation and update the pantry's open hours.
   */
  onClickUpdatePantryOpenHours() {
    let pid = this.props.pantry_id;
    let updDay = this.props.day;

    if (
      window.confirm(
        "Are you sure you want to make these updates on your open hours?"
      )
    ) {
      PantryService.updateOpenHours(pid, updDay, {
        day: updDay,
        open: this.newOpen.current.value,
        close: this.newClose.current.value,
        detail: this.newDetail.current.value,
      })
        .then(() => {
          // propogate updates back to parent component
          this.props.updateOpenHours(updDay, [
            this.newOpen.current.value,
            this.newClose.current.value,
            this.newDetail.current.value,
          ]);

          this.editModeControl(false);
          toast.success("Pantry's open hours was successfully updated!");
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  /**
   *
   * @returns
   */
  editButtonControl() {
    if (this.state.editMode) {
      return (
        <Row>
          <Col>
            <Button onClick={this.onClickUpdatePantryOpenHours.bind(this)}>
              Update
            </Button>
          </Col>
          <Col>
            <Button
              variant="danger"
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
          Edit Open Hours
        </Button>
      );
    }
  }

  // TODO: add edit open hour form
  // https://mdbootstrap.com/docs/react/forms/time-picker/

  /**
   *
   * @returns dynamic views based on whether the admin is in editMode or not
   */
  getDynamicViews() {
    const hoursEditOn = (
      <Form>
        <Form.Group controlId={`formHours + ${this.props.day}`}>
          <Row className="align-items-center">
            <Col>
              open:
              <Form.Control
                type="text"
                ref={this.newOpen}
                disabled={!this.state.editMode}
                defaultValue={this.props.open}
              />
            </Col>
            <Col>
              closed:
              <Form.Control
                type="text"
                ref={this.newClose}
                disabled={!this.state.editMode}
                defaultValue={this.props.close}
              />
            </Col>
            <Col>
              detail:
              <Form.Control
                as="textarea"
                ref={this.newDetail}
                disabled={!this.state.editMode}
                defaultValue={this.props.detail}
              />
            </Col>
            <Col xs={4}>{this.editButtonControl(this.props.day)}</Col>
          </Row>
        </Form.Group>
      </Form>
    );

    const hoursEditOff = (
      <>
        <Card.Text className="mb-3">
          <Row className="align-items-center">
            <Col xs={9} className="text-left">
              <div ref={this.newOpen} defaultValue={this.props.open}>
                <strong>Open: </strong> {formatters.time(this.props.open)}
              </div>
              <hr />
              <div ref={this.newClose} defaultValue={this.props.close}>
                <strong>Close: </strong> {formatters.time(this.props.close)}
              </div>
              <hr />
              <div ref={this.newDetail} defaultValue={this.props.detail}>
                <strong>Detail: </strong> {this.props.detail}
              </div>
              <hr />
            </Col>
            <Col xs={3}>{this.editButtonControl(this.props.day)}</Col>
          </Row>
        </Card.Text>
      </>
    );

    return (
      <Card.Text className="mb-1">
        {this.state.editMode ? hoursEditOn : hoursEditOff}
      </Card.Text>
    );
  }

  /**
   *
   * @returns rendered components
   */
  render() {
    const daysOfTheWeek = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    };
    return (
      <>
        <Col xs={2} className="text-left">
          {daysOfTheWeek[this.props.day]}
        </Col>
        <br />
        <Col xs={10}>{this.getDynamicViews()}</Col>
      </>
    );
  }
}
export default DashboardOpenHourCard;
