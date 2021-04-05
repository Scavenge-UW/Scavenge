import React, { Component } from "react";

// import for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { ListGroup, ListGroupItem, ListGroupItemHeading } from "reactstrap";

// import for components
import ViewRsvnMsgModal from "./modals/ViewRsvnMsgModal";
import DashboardDescriptionCard from "./DashboardDescriptionCard";
import DashboardOpenHourCard from "./DashboardOpenHourCard";
import DashboardMessage from "./DashboardMessage";

// import for services
import PantryService from "../services/pantry.service";

// other imports
import moment, { parseTwoDigitYear } from "moment";
import { toast } from "react-toastify";

/**
 * Dashboard View
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 *
 */
class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pantryName: "",
      rsvns: [],
      foods: [],
      hours: [],
      description: "",
      address: "",
      zipcode: "",
      city: "",
      stte: "",
      phone: "",
      weblink: "",

      // show reservation message, default false
      showRsvnMsg: false,

      // default selectedID = null,
      // this is used to passing information to ViewRsvnMsgModal
      selectedID: null,
      selecedUsername: "",
      selectedApproved: null,
      selectedPickedUp: null,
      selectedCancelled: null,

      // used to calculate time elapsed since the reservation is made
      currentDateTime: moment(new Date(), "YYYY/MM/DD HH:mm:ss"),
    };
  }

  componentDidMount() {
    const pantry = this.props.pantryDetail;

    if (pantry) {
      console.log(pantry);
      this.setState(
        {
          pantryName: pantry.name,
          rsvns: pantry.reservations,
          foods: pantry.foods,
          hours: pantry.hours,
          description: pantry.details,
          address: pantry.address,
          zipcode: pantry.zip,
          city: pantry.city,
          stte: pantry.state,
          phone: pantry.phone_number,
          weblink: pantry.website,
        },
        () => this.getDashboardOverview() // TODO: not sure if this is needed.
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  //////////////////////////// Reservation Message ////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

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
      modalMessageHeader: "",
      modalBodyContent: "",
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
   * Returns the textual description of the current dashboard.
   *
   */
  getDashboardOverview() {
    const numReservation = Object.keys(this.state.rsvns).length;

    return (
      <p className="text-center mt-4">
        You have {numReservation} new reservations today.
      </p>
    );
  }

  /**
   * @returns the message header (title and reservation time) for each message.
   */
  getMessageHeader(rsvn_id) {
    let rsvn = {};
    for (const r of this.state.rsvns) {
      if (r.reservation_id === rsvn_id) {
        rsvn = { ...r };
      }
    }

    const usernameStyle = {
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

    const username = <span style={usernameStyle}>{rsvn.username}</span>;

    // TODO: change this when backend is updated
    // const numItems = (
    //   <span style={usernameStyle}>
    //     {Object.keys(rsvn.reserved_items).length}
    //   </span>
    // );
    const numItems = 0;

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
  getMessageOverview() {
    const viewMessages = this.state.rsvns.map((rsvn) => (
      <ListGroupItem tag="a" className="justify-content-center" action>
        {/* Heading */}
        <ListGroupItemHeading className="mb-1">
          {this.getMessageHeader(rsvn.reservation_id)}
        </ListGroupItemHeading>

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
    return <ListGroup variant="fluid">{viewMessages}</ListGroup>; // BUG: fluid not displaying
  }

  /////////////////////////////////////////////////////////////////////////////
  //////////////////////////// Pantry Description /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  /**
   *
   */
  getDescriptionCards() {
    return (
      <DashboardDescriptionCard
        pantryName={this.state.pantryName}
        description={this.state.description}
        address={this.state.address}
        zipcode={this.state.zipcode}
        city={this.state.city}
        stte={this.state.stte}
        phone={this.state.phone}
        weblink={this.state.weblink}
      />
    );
  }

  /**
   * Renders components.
   *
   */
  render() {
    return (
      <Container>
        {/* Pantry's name */}
        <Row className="justify-content-center">
          <h2>{this.state.pantryName}</h2>
        </Row>
        {/* Page title */}
        <Row className="justify-content-center">
          <h3>Dashboard</h3>
        </Row>
        <hr />
        {/* Overview message */}
        <Row className="justify-content-center">
          {this.getDashboardOverview()}
        </Row>
        {/* Sub-session title */}
        <Row className="justify-content-center">
          <h4>Messages </h4>
        </Row>
        {/* Sub-session content (TODO: adjust style) */}
        <Row className="justify-content-center">
          {this.getMessageOverview()}
        </Row>
        {/* TODO: add changes */}
        <Row className="justify-content-center">
          <DashboardMessage />
        </Row>
        {/* Description */}
        <Row className="justify-content-center pt-4">
          {this.getDescriptionCards()}
        </Row>
        {/* Open Hours */}
        <Row className="justify-content-center pt-4">
          <DashboardOpenHourCard openHours={this.state.hours} />
        </Row>
        {/* Reservation Message Modal */}
        <ViewRsvnMsgModal
          show={this.state.showRsvnMsg}
          onHide={() => this.closeViewRsvnMsgModal()}
          selectedID={this.state.selectedID}
          selectedUsername={this.state.selectedUsername}
          selectedApproved={this.state.selectedApproved}
          selectedPickedUp={this.state.selectedPickedUp}
          selectedCancelled={this.state.selectedCancelled}
          rsvns={this.state.rsvns}
        />
      </Container>
    );
  }
}

export default DashboardView;
