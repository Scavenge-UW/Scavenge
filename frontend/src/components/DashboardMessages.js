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
import moment from "moment";
import { toast } from "react-toastify";
import "../css/common.css";

/////
///// DISABLED BUTTONS
/////

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
    // this.openViewRsvnMsgModal = this.openViewRsvnMsgModal.bind(this);
    // this.markAsApproved = this.markAsApproved.bind(this);
    // this.markAsPickedUp = this.markAsPickedUp.bind(this);
    // this.markAsCancelled = this.markAsCancelled.bind(this);
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

  approvedButtonIsDisabled(rsvn) {
    // if rsvn is cancelled, approved button should not be up
    if (rsvn.cancelled) return true;
    // if rsvn is approved, approved button should not be up
    else if (rsvn.approved) return true;
    // if rsvn is picked up, approved button should not be up
    else if (rsvn.picked_up_time) return true;
    else return false;
  }

  pickedupButtonIsDisabled(rsvn) {
    // if rsvn is cancelled, pickedup button should not be up
    if (rsvn.cancelled) return true;
    // if rsvn is not approved, pickedup button should not be up
    else if (!rsvn.approved) return true;
    // if rsvn is picked up, pickedup button should not be up
    else if (rsvn.picked_up_time) return true;
    else return false;
  }

  cancelButtonIsDisabled(rsvn) {
    // if rsvn is cancelled, pickedup button should not be up
    if (rsvn.cancelled) return true;
    else return false;
  }

  /**
   * Iteratively returns messages according to the number of reservations received
   * and buttons for some actions.
   *
   */
  render() {
    /*
    TODO: add a expand button to hide some reservation messages when len(messages) > 2
    */
    const viewMessages = this.props.rsvns.map((rsvn) => (
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

        {/* TODO: buttons should be disabled accordingly */}

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
                // TODO: approved/pickedup/cancelled values not changed
                // it requires a refresh of the page to see the updates
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
          View Message
        </Button>

        {/* Approve this reservation Button */}
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
                  this.props.markAsApproved(this.state.selectedID, 1);
                }
              );
            }
            // this.props.fetchPantryDetail();
          }}
          disabled={this.approvedButtonIsDisabled(rsvn)}
        >
          Approve this reservation
        </Button>

        {/* Mark as Picked Up Button */}
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
                  this.props.markAsPickedUp(this.state.selectedID, 1);
                }
              );
            }
            // this.props.fetchPantryDetail();
          }}
          disabled={this.pickedupButtonIsDisabled(rsvn)}
        >
          Mark as Picked up
        </Button>

        {/* Cancel this reservation Button */}
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
                  this.props.markAsCancelled(this.state.selectedID, 1);
                }
              );
            }
            // this.props.fetchPantryDetail();
          }}
          disabled={this.cancelButtonIsDisabled(rsvn)}
        >
          Cancel this reservation
        </Button>

        {/* 
        reset button is used to debug with Ilkyu
        and used for making disabled button enabled
        e.g. cancelled = 1, clicking 'reset' will make 
             `marked as picked up` button enabled 
        */}
        <Button
          variant="dark"
          size="sm"
          className="m-2"
          md="auto"
          onClick={() => {
            if (window.confirm("Reset this reservation?")) {
              this.setState(
                {
                  selectedID: rsvn.reservation_id,
                  selectedCancelled: rsvn.cancelled,
                },
                () => {
                  this.props.markAsApproved(this.state.selectedID, 1);
                }
              );
            }
          }}
          disabled={false}
        >
          reset
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
