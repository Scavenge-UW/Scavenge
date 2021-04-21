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
import { Link } from "react-router-dom";
import "../css/common.css";
import formatters from "./formatters/DatetimeFormatter"; // time formatters
import msgFunctions from "./functions/MsgButtons.functions"; // message helper functions
import ScrollToTop from "./functions/ScrollToTop.function";

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
   * Show control buttons based on current mode (adminMode vs userMode)
   */
  showControls(rsvn) {
    var controls;
    const approveButton = !msgFunctions.approvedButtonIsHidden(rsvn) && ( // Approve this reservation Button
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

    const markAsPickedUpButton = !msgFunctions.pickedupButtonIsHidden(rsvn) && (
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

    const cancelReservationButton = !msgFunctions.cancelButtonIsHidden(
      rsvn
    ) && (
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
                this.props.adminMode
                  ? this.props.markAsCancelled(this.state.selectedID)
                  : this.props.markWithDraw(
                      rsvn.pantry_id,
                      this.state.selectedID
                    );
              }
            );
          }
        }}
      >
        {this.props.adminMode
          ? "Cancel this reservation"
          : "Withdraw this reservation"}
      </Button>
    );

    /* 
    reset button is used for making disabled button enabled
    by marking the reservation as approved
       
    e.g. 
    cancelled = 1, clicking 'reset' will make
    `marked as picked up` button enabled
    */
    const resetButton = !msgFunctions.resetButtonIsHidden(rsvn) && (
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
      .filter((rsvn) =>
        // filter messages to show only today's reservations for admin mode
        // and show this week's reservations for user mode
        this.props.adminMode
          ? formatters.getTimeElapsed(rsvn.order_time, "hours") < 24
          : formatters.getTimeElapsed(rsvn.order_time, "days") < 7
      )
      .sort((a, b) => b.reservation_id - a.reservation_id) // sort message from most recent to least
      .map((rsvn) => (
        <ListGroupItem
          tag="a"
          className="justify-content-center p-3 mt-1"
          key={rsvn.reservation_id}
          action
        >
          {/* Heading */}
          <ListGroupItemHeading className="mb-1">
            {msgFunctions.getMessageHeader(
              rsvn,
              this.props.adminMode,
              this.props.adminMode ? null : "/pantries/" + rsvn.pantry_id
            )}
          </ListGroupItemHeading>
          <hr />
          {/* Body (status) */}
          <ListGroupItemText>
            {msgFunctions.getMessageStatus(rsvn)}
          </ListGroupItemText>

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
        {/* View older messages */}
        {this.props.rsvns && (
          <Row className="justify-content-center mt-2">
            <Link to={"/messages/" + this.props.pantry_id}>
              <strong>View Older Messages</strong>
            </Link>
          </Row>
        )}

        {/* message session title */}
        <Row className="justify-content-center mt-2">
          <h4>Messages</h4>
        </Row>

        {/* message session content */}
        <Row className="justify-content-center">
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
        </Row>

        {/* Scroll to top button */}
        <Row className="justify-content-center mt-4">
          <ScrollToTop scrollStepInPx="100" delayInMs="10.50" />
        </Row>
      </>
    );
  }
}

export default DashboardMessages;
