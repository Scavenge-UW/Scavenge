import React, { Component } from "react";

// import for calculating current time
import moment from "moment";

// import for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { ListGroup, ListGroupItem, ListGroupItemHeading } from "reactstrap";

// import for components
import ViewRsvnMsgModal from "./modals/ViewRsvnMsgModal";
import PantryDescriptionCard from "./PantryDescriptionCard";
import OpenHourCard from "./OpenHourCard";

// import for services
// import PantryService from "../services/pantry.service";

/**
 * Dashboard View
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 *         [Yayen Lin](https://github.com/yayen-lin)
 */
class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pantryName: "",
      rsvns: [],
      foods: [],
      hours: [],

      // show reservation message, default false
      showRsvnMsg: false,

      // TODO: set a default ID so that it can run
      // used to passing information to reservation message modal
      selectedID: 1,

      // used to calculate time elapsed since the reservation is made
      currentDateTime: moment(new Date(), "YYYY/MM/DD HH:mm:ss"),
    };
  }

  componentDidMount() {
    if (this.props.pantryDetail) {
      console.log(this.props.pantryDetail);
      this.setState(
        {
          pantryName: this.props.pantryDetail.name,
          rsvns: this.props.pantryDetail.reservations,
          foods: this.props.pantryDetail.foods,
          hours: this.props.pantryDetail.hours,
        },
        () => this.getDashboardOverview()
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
   * Helper function for getTimeElapsed to format time elapsed since the reservation received.
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
   * Iteratively returns messages according to the number of reservations received.
   *
   */
  getMessageOverview() {
    const viewMessages = this.state.rsvns.map((rsvn) => (
      <ListGroupItem tag="a" action>
        {/* Heading */}
        <ListGroupItemHeading className="mb-1">
          {this.getMessageHeader(rsvn.reservation_id)}
        </ListGroupItemHeading>
        {/* Buttons */}
        <Button
          variant="outline-info"
          className="m-2"
          md="auto"
          onClick={() => {
            this.setState(
              { selectedID: rsvn.reservation_id },
              this.openViewRsvnMsgModal
            );
          }}
        >
          View Message
        </Button>
        <Button variant="outline-primary" className="m-2" md="auto">
          Mark as Picked up
        </Button>
        <Button variant="outline-danger" className="m-2" md="auto">
          Cancel this reservation
        </Button>
      </ListGroupItem>
    ));
    return <ListGroup variant="flush">{viewMessages}</ListGroup>;
  }

  /////////////////////////////////////////////////////////////////////////////
  //////////////////////////// Pantry Description /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  /**
   *
   */
  // getPantryDescriptionCards() {
  //   return <pantryDescriptionCard />;
  // }

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
        {/* Description */}
        <Row className="justify-content-center pt-4">
          <PantryDescriptionCard />
        </Row>
        {/* Open Hours */}
        <Row className="justify-content-center pt-4">
          <OpenHourCard openHours={this.state.hours} />
        </Row>
        {/* Reservation Message Modal */}
        <ViewRsvnMsgModal
          show={this.state.showRsvnMsg}
          onHide={() => this.closeViewRsvnMsgModal()}
          selectedID={this.state.selectedID}
          state={this.state}
        />
      </Container>
    );
  }
}

export default DashboardView;
