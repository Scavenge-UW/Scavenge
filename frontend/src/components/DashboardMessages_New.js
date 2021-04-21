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
import "../css/common.css";
import formatters from "./formatters/DatetimeFormatter"; // time formatters

/**
 * Message view for user (admin/staff) to view their reservation messages.
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */
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
   * Set pagination to selected page
   * @param {*} pageNo
   */
  setCurrPage(pageNo) {
    this.setState({
      currPage: pageNo,
    });
  }

  /*
      TODO: 
      marked complete reservation with check2-circle icon
      marked cancelled reservation with x-circle icon
      - https://icons.getbootstrap.com
  */
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

    const timeElapsedStyle = {
      color: "--gray",
      textAlign: "right",
      fontSize: "60%",
      fontWeight: "300",
      paddingLeft: "2px",
    };

    const messageStyle = {
      textAlign: "left",
      fontSize: "95%",
      fontWeight: "light",
      paddingLeft: "2px",
    };

    const receivedTime = rsvn.order_time;
    const numItems = (
      <span style={monoStyle}>{Object.keys(rsvn.res_foods).length}</span>
    );
    let message;
    if (this.props.adminMode) {
      const username = <span style={monoStyle}>{rsvn.username}</span>;
      message = ["User ", username, " just reserved ", numItems, " items!"];
    } else {
      const pantryname = (
        <Button
          tag="a"
          onClick={() => window.open(this.props.weblink, "_blank")}
          variant="link"
          // size="sm"
        >
          <em>{rsvn.name}</em>
        </Button>
      );
      message = ["You have  ", numItems, " items reserved at ", pantryname];
    }

    const messageHeader = (
      <Row className="align-items-center" style={messageStyle}>
        <Col xs={10} className="text-left">
          {message}
        </Col>
        <Col xs={2} className="text-right" style={timeElapsedStyle}>
          {formatters.formatTimeElapsed(receivedTime)} ago.
        </Col>
      </Row>
    );

    return messageHeader;
  }

  /**
   * Set visibility of Approved Button
   */
  approvedButtonIsHidden(rsvn) {
    // if rsvn is cancelled, approved button should not be up
    if (rsvn.cancelled) return true;
    // if rsvn is approved, approved button should not be up
    else if (rsvn.approved) return true;
    // if rsvn is picked up, approved button should not be up
    else if (rsvn.picked_up_time) return true;
    else return false;
  }

  /**
   * Set visibility of Picked-Up Button
   */
  pickedupButtonIsHidden(rsvn) {
    // if rsvn is cancelled, pickedup button should not be up
    if (rsvn.cancelled) return true;
    // if rsvn is not approved, pickedup button should not be up
    else if (!rsvn.approved) return true;
    // if rsvn is picked up, pickedup button should not be up
    else if (rsvn.picked_up_time) return true;
    else return false;
  }

  /**
   * Set visibility of Cancel Button
   */
  cancelButtonIsHidden(rsvn) {
    // if rsvn is cancelled, cancelled button should not be up
    if (rsvn.cancelled) return true;
    // if rsvn is picked up, cancelled button should not be up
    if (rsvn.picked_up_time) return true;
    else return false;
  }

  /**
   * Set visibility of Reset Button
   */
  resetButtonIsHidden(rsvn) {
    // if rsvn is approved and picked up, reset button should not be up
    if (rsvn.approved && rsvn.picked_up_time) return true;
    // if rsvn is picked up, cancelled button should not be up
    else return false;
  }

  /**
   * Show control buttons based on current mode (adminMode vs userMode)
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

    /* 
    reset button is used for making disabled button enabled
    by marking the reservation as approved
       
    e.g. 
    cancelled = 1, clicking 'reset' will make
    `marked as picked up` button enabled
    */
    const resetButton = !this.resetButtonIsHidden(rsvn) && (
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
      controls = [cancelReservationButton]; // TODO: button not functioning
    }

    return controls;
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
        value: formatters.datetime(rsvn.order_time),
        bgColor: "#F7F7F7",
      },
      {
        key: "APPROVED:",
        value: rsvn.approved ? "approved" : "not approved",
        bgColor: "#FFFFFF",
      },
      {
        key: "ESTIMATED PICK UP AT:",
        value: formatters.datetime(rsvn.estimated_pick_up),
        bgColor: "#F7F7F7",
      },
      {
        key: "PICKED UP AT:",
        value: rsvn.picked_up_time
          ? formatters.datetime(rsvn.picked_up_time)
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
    TODO: display all messages for admin view in Pagination
    */
    const viewMessagesForToday = [...this.props.rsvns]
      .filter(
        (rsvn) => formatters.getTimeElapsed(rsvn.order_time, "hours") < 24
      )
      .sort((a, b) => b.reservation_id - a.reservation_id)
      .map((rsvn) => (
        <ListGroupItem
          tag="a"
          className="justify-content-center p-3 mt-1"
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

          <Row className="justify-content-center align-items-center">
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

            {/* 
              approved/pickedup/cancelled/reset buttons for adminMode,
              cancelled buttons for userMode
            */}
            {this.showControls(rsvn)}
          </Row>
        </ListGroupItem>
      ));

    return (
      <>
        <ListGroup className="w-responsive w-75 mx-auto">
          {viewMessagesForToday}
        </ListGroup>

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
