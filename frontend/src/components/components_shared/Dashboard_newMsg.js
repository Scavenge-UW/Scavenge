import React, { Component } from "react";
import { Link } from "react-router-dom";

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
import EditEstModal from "../modals/EditEstModal";
import ViewRsvnMsgModal from "../modals/ViewRsvnMsgModal";

// other imports
import "../../css/common.css";
import msgFunctions from "../helper_functions/msgAndBtns.function"; // message helper functions
import ScrollToTop from "../helper_functions/ScrollToTop.function";
import formatters from "../helper_functions/DatetimeFormatter.function"; // time formatters

/**
 * Message view for user (admin/staff) to view their reservation messages.
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */
class Dashboard_newMsg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // show reservation message, default false
      showRsvnMsg: false,
      // show edit est pickup time modal, default false
      showEditEst: false,

      // default selectedID = null,
      // this is used to passing information to ViewRsvnMsgModal and EditEstModal
      selectedID: null,
      selectedRsvn: null,
      selecedUsername: "",
      selectedApproved: null,
      selectedPickedUp: null,
      selectedCancelled: null,
      selectedResFoods: null,
      selectedEstPickup: null,
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
   * opens edit est pickup time modal
   */
  openEditEstModal() {
    this.setState({
      showEditEst: true,
    });
  }

  /**
   * closes edit est pickup time modal
   */
  closeEditEstModal() {
    this.setState({
      showEditEst: false,
    });
  }

  /**
   * update est pickup time
   *
   * @param {*} estTime - desire est pickup time to update
   */
  updateEstPickupTime(estTime) {
    msgFunctions.updateEstPickupTime(
      this.state.selectedID,
      estTime,
      this.props.pantry_id,
      () => this.props.fetchPantryDetail()
    );
    this.setState({
      selectedEstPickup: estTime,
    });
  }

  /**
   * Show control buttons based on current mode (adminMode vs userMode)
   */
  showControls(rsvn) {
    var controls;

    // approved button
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
                msgFunctions.markAsApproved(
                  this.state.selectedID,
                  this.props.pantry_id,
                  () => this.props.fetchPantryDetail()
                );
              }
            );
          }
        }}
      >
        Approve This Reservation
      </Button>
    );

    // Mark as Picked Up Button
    const markAsPickedUpButton = !msgFunctions.pickedupButtonIsHidden(rsvn) && (
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
                msgFunctions.markAsPickedUp(
                  this.state.selectedID,
                  this.props.pantry_id,
                  () => this.props.fetchPantryDetail()
                );
              }
            );
          }
        }}
      >
        Mark as Picked up
      </Button>
    );

    // Cancel this reservation Button
    const cancelReservationButton = !msgFunctions.cancelButtonIsHidden(
      rsvn
    ) && (
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
                  ? this.props.markAsCancelled(
                      this.state.selectedID,
                      this.props.pantry_id,
                      () => this.props.fetchPantryDetail()
                    )
                  : this.props.markWithDraw(
                      this.state.selectedID,
                      rsvn.pantry_id,
                      () => this.props.fetchPantryDetail()
                    );
              }
            );
          }
        }}
      >
        {this.props.adminMode
          ? "Cancel This Reservation"
          : "Withdraw This Reservation"}
      </Button>
    );

    // reset button
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
                this.props.markAsApproved(
                  this.state.selectedID,
                  this.props.pantry_id,
                  () => this.props.fetchPantryDetail()
                );
              }
            );
          }
        }}
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
      controls = [cancelReservationButton];
    }

    return controls;
  }

  /**
   * Iteratively returns messages according to the number of reservations received
   * and buttons for some actions.
   */
  render() {
    // Render message object for today
    const viewMessagesForToday = [...this.props.rsvns]
      .filter((rsvn) =>
        // filter messages to show only today's reservations for admin mode
        // and show this week's reservations for user mode
        this.props.adminMode
          ? formatters.getTimeElapsed(rsvn.order_time, "hours") < 24
          : formatters.getTimeElapsed(rsvn.order_time, "days") < 7
      )
      .sort((a, b) => b.reservation_id - a.reservation_id) // sort message from most recent to least
      .slice(0, this.props.adminMode ? 2 : 5) // show only 2 messages at most for admin, 5 for user in overview
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

            {/* render controlled btns based on user type */}
            {this.showControls(rsvn)}

            {this.props.adminMode && !msgFunctions.editEstButtonIsHidden(rsvn) && (
              <Button
                variant="dark"
                size="sm"
                className="m-2"
                md="auto"
                onClick={() => {
                  this.setState(
                    {
                      selectedID: rsvn.reservation_id,
                      selectedEstPickup: rsvn.estimated_pick_up,
                    },
                    () => {
                      this.openEditEstModal();
                    }
                  );
                }}
              >
                Edit Estimated Pickup Time
              </Button>
            )}
          </Row>
        </ListGroupItem>
      ));

    return (
      <>
        <Row className="justify-content-center mt-2">
          {this.props.adminMode ? (
            // adminMode
            <Link to={"/messageCenter/" + this.props.pantry_id}>
              <text style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                View All And Search For Messages
              </text>
            </Link>
          ) : (
            // userMode
            <Link to={"/messageCenter/" + this.props.username}>
              <text style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                View All And Search For Reservations
              </text>
            </Link>
          )}
        </Row>
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

          {/* Edit Est Pickup Time Modal */}
          <EditEstModal
            show={this.state.showEditEst}
            selectedEstPickup={this.state.selectedEstPickup}
            updateEstPickupTime={(estTime) => this.updateEstPickupTime(estTime)}
            onHide={() => this.closeEditEstModal()}
          />
        </Row>
        {/* Scroll to top button for user to view their reservations */}
        {!this.props.adminMode && (
          <Row className="justify-content-center mt-4">
            <ScrollToTop scrollStepInPx="100" delayInMs="10.50" />
          </Row>
        )}
      </>
    );
  }
}

export default Dashboard_newMsg;
