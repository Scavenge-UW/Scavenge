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

class DashboardOpenHourCard extends Component {
  constructor(props) {
    super(props);

    this.newOpenHours = React.createRef();
    this.newClosedHours = React.createRef();
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
      console.log("3", this.props.open, this.props.close, this.props.detail);
      this.newOpenHours.current.value = this.props.open;
      this.newClosedHours.current.value = this.props.close;
      this.newDetail.current.value = this.props.detail;
      console.log("3.5");
      console.log("4", this.newOpenHours, this.newClosedHours, this.newDetail);
    }
  }

  /**
   * Ask for confirmation and update the pantry's open hours.
   */
  onClickUpdatePantryOpenHours() {
    let pid = this.props.pantry_id;
    let updDay = this.props.day;

    console.log("1", this.props.open, this.props.close, this.props.detail);

    if (
      window.confirm(
        "Are you sure you want to make these updates on your open hours?"
      )
    ) {
      PantryService.updateOpenHours(pid, updDay, {
        day: updDay,
        open: this.newOpenHours.current.value,
        close: this.newClosedHours.current.value,
        detail: this.newDetail.current.value,
      })
        .then(() => {
          console.log(
            "2",
            this.newOpenHours.current.value,
            this.newClosedHours.current.value,
            this.newDetail.current.value
          );
          // propogate updates back to parent component
          this.props.updateOpenHours(updDay, [
            this.newOpenHours.current.value,
            this.newClosedHours.current.value,
            this.newDetail.current.value,
          ]);

          toast.success("Pantry's open hours was successfully updated!");

          this.editModeControl(false);
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
  /**
   * convert 24-hour time-of-day string to 12-hour time with AM/PM and no timezone
   *
   * @param {*} time - time string
   * @returns
   */
  tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  /**
   *
   * @returns dynamic views based on whether the admin is in editMode or not
   */
  getDynamicViews() {
    const hoursEditOn = (
      <Form>
        <Form.Group controlId="formHours">
          <Row className="align-items-center">
            <Col>
              open:
              <Form.Control
                type="text"
                ref={this.newOpenHours}
                disabled={!this.state.editMode}
                defaultValue={this.props.open}
              />
            </Col>
            <Col>
              closed:
              <Form.Control
                type="text"
                ref={this.newClosedHours}
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
              <strong>Open: </strong> {this.tConvert(this.props.open)} <hr />
              <strong>Close: </strong> {this.tConvert(this.props.close)} <hr />
              <strong>Detail: </strong> {this.props.detail} <hr />
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
