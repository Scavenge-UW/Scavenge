import React, { Component } from "react";

// import for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { ListGroup, ListGroupItem, ListGroupItemHeading } from "reactstrap";

// import for services
import PantryService from "../services/pantry.service";

// import for components
import ViewRsvnMsgModal from "./modals/ViewRsvnMsgModal";

// other imports
import moment, { parseTwoDigitYear } from "moment";
import { toast } from "react-toastify";
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
    this.openViewRsvnMsgModal = this.openViewRsvnMsgModal.bind(this);
    this.markAsApproved = this.markAsApproved.bind(this);
    this.markAsPickedUp = this.markAsPickedUp.bind(this);
    this.markAsCancelled = this.markAsCancelled.bind(this);
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
      // modalMessageHeader: "",
      // modalBodyContent: "",
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

    // TODO: change this when backend is updated
    const numItems = (
      <span style={monoStyle}>{Object.keys(rsvn.res_foods).length}</span>
    );

    const receivedTime = rsvn.order_time;

    const messageHeader = (
      <Row className="justify-content-between align-items-center">
        <Col xs={8} className="text-left">
          User {username} just reserved {numItems} items!
        </Col>
        <Col xs={4} className="text-right" style={messageTimeStyle}>
          {this.getTimeElapsed(receivedTime)} ago.
        </Col>
      </Row>
    );

    return messageHeader;
  }

  /**
   * Mark a reservation as picked up
   * (TODO: need a undo button?)
   *
   */
  markAsPickedUp(rsvn_id, pantry_id) {
    console.log(rsvn_id);
    PantryService.setPickedUp(
      pantry_id, // TODO: Change to actual pantry id
      rsvn_id
    )
      .then(() => {
        toast.success(
          "reservation with ID " +
            rsvn_id +
            " was successfully marked as picked up!"
        );
      })
      .catch(() => {
        toast.error(
          "Error while marking reservation with ID " +
            rsvn_id +
            " as picked up."
        );
      });
  }

  /**
   * Mark a reservation as approved
   * (TODO: need a undo button?)
   *
   */
  markAsApproved(rsvn_id, pantry_id) {
    console.log(rsvn_id);
    PantryService.setApproved(
      pantry_id, // TODO: Change to actual pantry id
      rsvn_id
    )
      .then(() => {
        toast.success(
          "You have successfully approved the reservation with ID " + rsvn_id
        );
      })
      .catch(() => {
        toast.error("Error while approving reservation with ID " + rsvn_id);
      });
  }

  /**
   * Mark a reservation as cancelled
   * (TODO: need a undo button?)
   *
   */
  markAsCancelled(rsvn_id, pantry_id) {
    console.log(rsvn_id);
    PantryService.setCancelled(
      pantry_id, // TODO: Change to actual pantry id
      rsvn_id
    )
      .then(() => {
        toast.success(
          "You have successfully cancelled the reservation with ID " + rsvn_id
        );
      })
      .catch(() => {
        toast.error("Error while cancelling reservation with ID " + rsvn_id);
      });
  }

  /**
   * Iteratively returns messages according to the number of reservations received
   * and buttons for some actions.
   *
   */
  render() {
    const viewMessages = this.props.rsvns.map((rsvn) => (
      <ListGroupItem
        tag="a"
        className="justify-content-center w-responsive w-100 mx-auto p-3 mt-1"
        action
      >
        {/* Heading */}
        <ListGroupItemHeading className="mb-1">
          {this.getMessageHeader(rsvn.reservation_id)}
        </ListGroupItemHeading>
        <hr />

        {/* TODO: buttons should be disabled accordingly */}

        {/* Veiw Message Buttons */}
        <Button
          variant="outline-info"
          className="m-2"
          md="auto"
          onClick={() => {
            this.setState(
              {
                // TODO: approved/pickedup/cancelled values not changed
                // it requires a refresh of the page to see the updates
                selectedID: rsvn.reservation_id,
                selectedUsername: rsvn.username,
                selectedApproved: rsvn.approved,
                selectedPickedUp: rsvn.approved, // TODO: change this to picked up
                selectedCancelled: rsvn.cancelled,
                selectedResFoods: rsvn.res_foods,
              },
              () => {
                this.openViewRsvnMsgModal();
              }
            );
          }}
        >
          View Message
        </Button>

        {/* Approve this reservation Button */}
        <Button
          variant="outline-warning"
          className="m-2"
          md="auto"
          onClick={() => {
            this.setState(
              {
                selectedID: rsvn.reservation_id,
                selectedApproved: rsvn.approved,
              },
              () => {
                this.markAsApproved(this.state.selectedID, 1);
              }
            );
          }}
        >
          Approve this reservation
        </Button>

        {/* Mark as Picked Up Button */}
        <Button
          variant="outline-primary"
          className="m-2"
          md="auto"
          onClick={() => {
            this.setState(
              {
                selectedID: rsvn.reservation_id,
                selectedPickedUp: rsvn.approved, // TODO: change this to picked up
              },
              () => {
                this.markAsPickedUp(this.state.selectedID, 1);
              }
            );
          }}
          // disabled={this.state.selctedIdIsApproved}
          // disabled={this.isMarkedPickedUp(rsvn.reservation_id)}
        >
          Mark as Picked up
        </Button>

        {/* Cancel this reservation Button */}
        <Button
          variant="outline-danger"
          className="m-2"
          md="auto"
          onClick={() => {
            this.setState(
              {
                selectedID: rsvn.reservation_id,
                selectedCancelled: rsvn.cancelled,
              },
              () => {
                this.markAsCancelled(this.state.selectedID, 1);
              }
            );
          }}
        >
          Cancel this reservation
        </Button>
      </ListGroupItem>
    ));
    return (
      <>
        <ListGroup>{viewMessages}</ListGroup>

        {/* Reservation Message Modal */}
        <ViewRsvnMsgModal
          show={this.state.showRsvnMsg}
          onHide={() => this.closeViewRsvnMsgModal()}
          selectedID={this.state.selectedID}
          selectedUsername={this.state.selectedUsername}
          selectedApproved={this.state.selectedApproved}
          selectedPickedUp={this.state.selectedPickedUp}
          selectedCancelled={this.state.selectedCancelled}
          selectedResFoods={this.state.selectedResFoods}
        />
      </>
    );
  }
}

export default DashboardMessages;
