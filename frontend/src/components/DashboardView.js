import React, { Component } from "react";

import moment from "moment";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
import { ListGroup, ListGroupItem, ListGroupItemHeading } from "reactstrap";

import ViewRsvnMsgModal from "./modals/ViewRsvnMsgModal";
import PantryDescriptionCard from "./PantryDescriptionCard";
import PantryDescription from "./PantryDescription"
import OpenHourCard from "./OpenHourCard";

/**
 * Dashboard View
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Jason Sutanto] (https://github.com/jsutanto19)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */
class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * Dummy Reseravtion examples.
       * TODO: fetch actual reservations from the API
       */
      pantryDetails: {
        foods: {
          1: {
            food_id: 1,
            food_name: "Apple",
            qr_code: null,
            quantity: 0,
          },
          2: {
            food_id: 2,
            food_name: "Orange",
            qr_code: null,
            quantity: 27,
          },
          3: {
            food_id: 3,
            food_name: "Avocado",
            qr_code: 123123123,
            quantity: 156,
          },
          4: {
            food_id: 4,
            food_name: "Swiss Cheese",
            qr_code: 10101011,
            quantity: 22,
          },
        },
        reservations: {
          1: {
            reservation_id: 1,
            username: "sean1",
            reserved_items: { 1: 3, 2: 5, 3: 3 },
            order_time: "2021-03-22T08:03:39.000Z",
            estimated_pick_up: "2021-03-30T02:00:00.000Z",
            picked_up_time: null,
            approved: 0,
            cancelled: 1,
          },
          106: {
            reservation_id: 106,
            username: "sean1",
            reserved_items: { 2: 4, 3: 7, 4: 2 },
            order_time: "2021-03-23T20:45:05.000Z",
            estimated_pick_up: "2021-03-30T02:00:00.000Z",
            picked_up_time: null,
            approved: 0,
            cancelled: 0,
          },
          107: {
            reservation_id: 107,
            username: "sean1",
            reserved_items: { 1: 5, 2: 3, 3: 1, 4: 1 },
            order_time: "2021-03-26T12:30:11.000Z",
            estimated_pick_up: "2021-03-30T02:00:00.000Z",
            picked_up_time: null,
            approved: 0,
            cancelled: 0,
          },
        },
        hours: {
          1: {
            day: 1,
            open: "10:00:00",
            close: "15:00:00",
            detail: "By Appointment Only",
          },
          2: {
            day: 2,
            open: "10:00:00",
            close: "15:00:00",
            detail: "By Appointment Only",
          },
          3: {
            day: 3,
            open: "10:00:00",
            close: "15:00:00",
            detail: "By Appointment Only",
          },
          4: {
            day: 4,
            open: "10:00:00",
            close: "15:00:00",
            detail: "By Appointment Only",
          },
          5: {
            day: 5,
            open: "10:00:00",
            close: "15:00:00",
            detail: "By Appointment Only",
          },
          6: {
            day: 6,
            open: "10:00:00",
            close: "15:00:00",
            detail: "By Appointment Only",
          },
          7: {
            day: 7,
            open: "10:00:00",
            close: "15:00:00",
            detail: "By Appointment Only",
          },
        },
        pantry_id: 1,
        name: "The River Food Pantry",
        address: "2201 Darwin Rd",
        zip: 53704,
        city: "Madison",
        state: "WI",
        phone_number: "6084428815",
        details: "Here to serve!",
        img_src:
          "https://lh5.googleusercontent.com/p/AF1QipM6UYI64xgIkJx1w_t7RLh8eVCjelB9ogeoW_A3=w426-h240-k-no",
        lat: -89,
        lon: 43,
        website: "https://www.riverfoodpantry.org/",
        approved: 0,
      },

      // show reservation message, default false
      showRsvnMsg: false,

      // TODO: set a default ID so that it can run
      // used to passing information to reservation message modal
      selectedID: 1,

      // used to calculate time elapsed since the reservation is made
      currentDateTime: moment(new Date(), "YYYY/MM/DD HH:mm:ss"),
    };
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
   * Returns the textual description of the current inventory.
   *
   */
  getDashboardOverview() {
    let numReservation = Object.keys(this.state.pantryDetails.reservations)
      .length;

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
    const rsvn = this.state.pantryDetails.reservations[rsvn_id];
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

    const numItems = (
      <span style={usernameStyle}>
        {Object.keys(rsvn.reserved_items).length}
      </span>
    );

    const receivedTime = rsvn.order_time;

    // TODO: re-adjust the styling
    const messageHeader = (
      <div>
        User {username} has reserved {numItems} items at your food pantry!
        {/* Change messageTime according to API */}
        <p class="text-right" style={messageTimeStyle}>
          {this.getTimeElapsed(receivedTime)} ago.
        </p>
      </div>
    );

    return messageHeader;
  }

  /**
   * Iteratively returns messages according to the number of reservations received.
   *
   */
  getMessageOverview() {
    const viewMessages = Object.keys(this.state.pantryDetails.reservations).map(
      (rsvn_id, key) => (
        <ListGroupItem tag="a" action>
          {/* Heading */}
          <ListGroupItemHeading key={key} className="mb-1">
            {this.getMessageHeader(rsvn_id)}
          </ListGroupItemHeading>
          {/* Button */}
          <Button
            variant="outline-info"
            className="mr-2"
            onClick={() => {
              this.setState({ selectedID: rsvn_id }, this.openViewRsvnMsgModal);
            }}
          >
            View Message
          </Button>
          <Button variant="outline-primary" className="mr-2">
            Mark as Picked up
          </Button>
          <Button variant="outline-danger" className="mr-2">
            Cancel this reservation
          </Button>
        </ListGroupItem>
      )
    );
    return <ListGroup>{viewMessages}</ListGroup>;
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
        {/* Page title */}
        <Row className="justify-content-center">
          <h2>Dashboard</h2>
        </Row>
        <hr />
        {/* Overview message */}
        <Row className="justify-content-center">
          {this.getDashboardOverview()}
        </Row>
        {/* Sub-session title */}
        <Row className="justify-content-center">
          <h4>Messgaes </h4>
        </Row>
        {/* Sub-session content (TODO: adjust style) */}
        <Row className="justify-content-center">
          {this.getMessageOverview()}
        </Row>

        <Row className="justify-content-center pt-4">
          {/* Jason's version */}
          <PantryDescription/> 
          {/* Andy's version */}
          <PantryDescriptionCard />
        </Row>
        <Row className="justify-content-center pt-4">
          <OpenHourCard openHours={this.state.pantryDetails.hours} />
        </Row>
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
