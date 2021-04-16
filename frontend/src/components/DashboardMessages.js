import React, { Component } from "react";

// import for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";

// import for components
import ViewRsvnMsgModal from "./modals/ViewRsvnMsgModal";

// other imports
import moment from "moment";
import "../css/common.css";

class DashboardMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // show reservation message, default false
      showRsvnMsg: false,

      // default selectedID = null,
      // this is used to passing information to ViewRsvnMsgModal
      selectedID: null,
      selecedUsername: "",
      selectedApproved: null,
      selectedPickedUp: null,
      selectedCancelled: null,
      selectedResFoods: null,

      // used to calculate time elapsed since the reservation is made
      currentDateTime: moment(new Date(), "YYYY/MM/DD HH:mm:ss"),
    };
  }

  /**
   * Opens View Reservation Message modal.
   *
   */
  openViewRsvnMsgModal() {
    this.setState({
      showRsvnMsg: true,
    });
  }

  /**
   * Closes View Reservation Message modal.
   *
   */
  closeViewRsvnMsgModal() {
    this.setState({
      showRsvnMsg: false,
    });
  }

  /**
   *
   * Helper function for `getTimeElapsed` to format time elapsed since the reservation received.
   *
   * reference:
   *          https://stackoverflow.com/questions/22938300/convert-milliseconds-to-hours-and-minutes-using-momentjs
   * example:
   *          durationAsString(0) will return -
   *          durationAsString(10000) will return 10s
   *          durationAsString(100000) will return 1m 40s
   *          durationAsString(10000000) will return 2h 46m 40s
   *          durationAsString(100000000) will return 1d 3h 46m
   *          durationAsString(100000000, 4) will return 1d 3h 46m 40s
   * @param {*} ms
   * @param {*} maxPrecission
   * @returns
   */
  durationAsString(ms, maxPrecission = 3) {
    const duration = moment.duration(ms);

    const items = [];
    items.push({ timeUnit: "d", value: Math.floor(duration.asDays()) });
    items.push({ timeUnit: "h", value: duration.hours() });
    items.push({ timeUnit: "m", value: duration.minutes() });
    items.push({ timeUnit: "s", value: duration.seconds() });

    const formattedItems = items.reduce((accumulator, { value, timeUnit }) => {
      if (
        accumulator.length >= maxPrecission ||
        (accumulator.length === 0 && value === 0)
      ) {
        return accumulator;
      }

      accumulator.push(`${value}${timeUnit}`);
      return accumulator;
    }, []);

    return formattedItems.length !== 0 ? formattedItems.join(" ") : "-";
  }

  /**
   * Calculates and returns the time elapsed since the reservation was made.
   *
   * @param {*} receivedTime the time (in String format) when the reservation was made
   */
  getTimeElapsed(receivedTime) {
    // convert receivedTime to moment object
    const received = moment(new Date(receivedTime), "YYYY/MM/DD HH:mm:ss");
    const current = this.state.currentDateTime;
    return this.durationAsString(current - received);
  }

  /**
   * @returns the message header (title and reservation time) for each message.
   */
  getMessageHeader(rsvn_id) {
    let rsvn = {};
    for (const r of this.props.rsvns) {
      if (r.reservation_id === rsvn_id) {
        rsvn = { ...r };
      }
    }

    const monoStyle = {
      fontFamily: "monospace",
      fontSize: "120%",
      fontWeight: "450",
    };

    const messageTimeStyle = {
      color: "--gray",
      textAlign: "right",
      fontSize: "60%",
      fontWeight: "300",
    };

    const username = <span style={monoStyle}>{rsvn.username}</span>;

    const numItems = (
      <span style={monoStyle}>{Object.keys(rsvn.res_foods).length}</span>
    );

    const receivedTime = rsvn.order_time;

    /*
    TODO: 
    marked complete reservation with check2-circle icon
    marked cancelled reservation with x-circle icon
    - https://icons.getbootstrap.com
    */
    var message;
    if (this.props.adminMode) {
      message = ["User ", username, " just reserved ", numItems, " items!"];
    } else {
      message = ["You just reserved ", numItems, " items!"];
    }

    const messageHeader = (
      <Row className="justify-content-between align-items-center">
        <Col xs={9} className="text-left">
          {message}
        </Col>
        <Col xs={3} className="text-right" style={messageTimeStyle}>
          {this.getTimeElapsed(receivedTime)} ago.
        </Col>
      </Row>
    );

    return messageHeader;
  }

  approvedButtonIsHidden(rsvn) {
    // if rsvn is cancelled, approved button should not be up
    if (rsvn.cancelled) return true;
    // if rsvn is approved, approved button should not be up
    else if (rsvn.approved) return true;
    // if rsvn is picked up, approved button should not be up
    else if (rsvn.picked_up_time) return true;
    else return false;
  }

  pickedupButtonIsHidden(rsvn) {
    // if rsvn is cancelled, pickedup button should not be up
    if (rsvn.cancelled) return true;
    // if rsvn is not approved, pickedup button should not be up
    else if (!rsvn.approved) return true;
    // if rsvn is picked up, pickedup button should not be up
    else if (rsvn.picked_up_time) return true;
    else return false;
  }

  cancelButtonIsHidden(rsvn) {
    // if rsvn is cancelled, cancelled button should not be up
    if (rsvn.cancelled) return true;
    // if rsvn is picked up, cancelled button should not be up
    if (rsvn.picked_up_time) return true;
    else return false;
  }

  resetButtonIsHidden(rsvn) {
    // if rsvn is approved and picked up, reset button should not be up
    if (rsvn.approved && rsvn.picked_up_time) return true;
    // if rsvn is picked up, cancelled button should not be up
    else return false;
  }

  /**
   * Show control buttons based on current mode (adminMode vs user mode)
   */
  showControls(rsvn) {
    var controls;
    const approveButton = !this.approvedButtonIsHidden(rsvn) && ( // Approve this reservation Button
      <Button
        // variant="outline-primary"
        variant="primary"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          if (window.confirm("Approve this reservation?")) {
            this.setState(
              {
                selectedID: rsvn.reservation_id,
                selectedApproved: rsvn.approved,
              },
              () => {
                this.props.markAsApproved(this.state.selectedID);
              }
            );
          }
        }}
      >
        Approve this reservation
      </Button>
    );

    const markAsPickedUpButton = !this.pickedupButtonIsHidden(rsvn) && (
      // {/* Mark as Picked Up Button */}
      <Button
        // variant="outline-success"
        variant="success"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          if (window.confirm("Mark this reservation as picked up?")) {
            this.setState(
              {
                selectedID: rsvn.reservation_id,
                selectedPickedUp: rsvn.picked_up_time,
              },
              () => {
                this.props.markAsPickedUp(this.state.selectedID);
              }
            );
          }
        }}
      >
        Mark as Picked up
      </Button>
    );

    const cancelReservationButton = !this.cancelButtonIsHidden(rsvn) && (
      // {/* Cancel this reservation Button */}
      <Button
        // variant="outline-danger"
        variant="danger"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          if (window.confirm("Cancel this reservation?")) {
            this.setState(
              {
                selectedID: rsvn.reservation_id,
                selectedCancelled: rsvn.cancelled,
              },
              () => {
                this.props.markAsCancelled(this.state.selectedID);
              }
            );
          }
        }}
      >
        Cancel this reservation
      </Button>
    );

    const resetButton = !this.resetButtonIsHidden(rsvn) && (
      // {/*
      // reset button is used for making disabled button enabled
      // by marking the reservation as approved
      // e.g. cancelled = 1, clicking 'reset' will make
      //      `marked as picked up` button enabled
      // */}
      <Button
        variant="dark"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          if (window.confirm("Reset and approve this reservation?")) {
            this.setState(
              {
                selectedID: rsvn.reservation_id,
                selectedCancelled: rsvn.cancelled,
              },
              () => {
                this.props.markAsApproved(this.state.selectedID);
              }
            );
          }
        }}
        disabled={false}
      >
        Reset and Approve
      </Button>
    );

    if (this.props.adminMode) {
      controls = [
        approveButton,
        markAsPickedUpButton,
        cancelReservationButton,
        resetButton,
      ];
    } else {
      // controls = cancelReservationButton;
      controls = [];
    }

    return controls;
  }

  // reference: https://stackoverflow.com/questions/50430968/converting-string-date-in-react-javascript
  /**
   * convert datetime string to desired format
   * (e.g. "2018-05-18T04:00:00.000Z" to "May 18, 2018, 4:00 AM")
   *
   * @param {*} timeString - date time string
   * @returns formatted date time string
   */
  formatDateTime(timeString) {
    let options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    options.timeZone = "UTC";
    // options.timeZoneName = "short";
    return new Date(timeString).toLocaleDateString(["en-US"], options);
  }

  /*
    TODO: 
    marked complete reservation with check2-circle icon
    marked cancelled reservation with x-circle icon
    add hover over description
    - https://icons.getbootstrap.com
    */

  /**
   * return formatted reservation status.
   */
  getMessageStatus(rsvn) {
    const keyStyle = {
      textAlign: "right",
      paddingRight: "3px",
      fontWeight: "bold",
      color: "#A9A9A9",
    };

    const valStyle = {
      textAlign: "left",
      justifyContent: "center",
      paddingLeft: "3px",
      fontFamily: "monospace",
      fontSize: "1.1rem",
    };

    return [
      {
        key: "ID:",
        value: `#${rsvn.reservation_id}`, // append a # in the front of id number
        bgColor: "#FFFFFF",
      },
      {
        key: "ORDERED AT:",
        value: this.formatDateTime(rsvn.order_time),
        bgColor: "#F7F7F7",
      },
      {
        key: "APPROVED:",
        value: rsvn.approved ? "approved" : "not approved",
        bgColor: "#FFFFFF",
      },
      {
        key: "ESTIMATED PICK UP AT:",
        value: this.formatDateTime(rsvn.estimated_pick_up),
        bgColor: "#F7F7F7",
      },
      {
        key: "PICKED UP AT:",
        value: rsvn.picked_up_time
          ? this.formatDateTime(rsvn.picked_up_time)
          : "not picked up",
        bgColor: "#FFFFFF",
      },
      {
        key: "CANCELLED:",
        value: rsvn.cancelled ? "cancelled" : "not cancelled",
        bgColor: "#F7F7F7",
      },
    ].map((entry, key) => (
      <Row
        key={key}
        style={{ backgroundColor: entry.bgColor, paddingTop: "3px" }}
      >
        <Col style={keyStyle}>{entry.key}</Col>
        <Col style={valStyle}>{entry.value}</Col>
      </Row>
    ));
  }

  /**
   * Iteratively returns messages according to the number of reservations received
   * and buttons for some actions.
   *
   */
  render() {
    /*
    TODO: add a expand button to hide some reservation messages when len(messages) > 3
    */
    const viewMessages = [...this.props.rsvns]
      .sort((a, b) => b.reservation_id - a.reservation_id)
      .map((rsvn) => (
        <ListGroupItem
          tag="a"
          className="justify-content-center w-responsive w-100 mx-auto p-3 mt-1"
          key={rsvn.reservation_id}
          action
        >
          {/* Heading */}
          <ListGroupItemHeading className="mb-1">
            {this.getMessageHeader(rsvn.reservation_id)}
          </ListGroupItemHeading>
          <hr />
          {/* Body (status) */}
          <ListGroupItemText>{this.getMessageStatus(rsvn)}</ListGroupItemText>

          <div className="justify-content-center align-items-center">
            {/* Veiw Message Buttons */}
            <Button
              // variant="outline-secondary"
              variant="secondary"
              size="sm"
              className="m-2"
              md="auto"
              onClick={() => {
                this.setState(
                  {
                    selectedID: rsvn.reservation_id,
                    selectedUsername: rsvn.username,
                    selectedApproved: rsvn.approved,
                    selectedPickedUp: rsvn.picked_up_time,
                    selectedCancelled: rsvn.cancelled,
                    selectedResFoods: rsvn.res_foods,
                  },
                  () => {
                    this.openViewRsvnMsgModal();
                  }
                );
              }}
            >
              View Reserved Foods
            </Button>

            {/* Buttons with approved/pickedup/cancelled/reset actions */}
            {this.showControls(rsvn)}
          </div>
        </ListGroupItem>
      ));

    return (
      <>
        <ListGroup>{viewMessages}</ListGroup>

        {/* Reservation Message Modal */}
        <ViewRsvnMsgModal
          show={this.state.showRsvnMsg}
          selectedID={this.state.selectedID}
          selectedUsername={this.state.selectedUsername}
          selectedApproved={this.state.selectedApproved}
          selectedPickedUp={this.state.selectedPickedUp}
          selectedCancelled={this.state.selectedCancelled}
          selectedResFoods={this.state.selectedResFoods}
          onHide={() => this.closeViewRsvnMsgModal()}
        />
      </>
    );
  }
}

export default DashboardMessages;
