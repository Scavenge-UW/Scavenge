import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";

import ViewRsvnMsgModal from "./modals/ViewRsvnMsgModal";

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
      /**
       * Dummy Reseravtion examples.
       * TODO: fetch actual reservations from the API or use Socket.io?
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
            order_time: "2021-03-25T08:03:39.000Z",
            estimated_pick_up: "2021-03-30T02:00:00.000Z",
            picked_up_time: null,
            approved: 0,
            cancelled: 1,
          },
          106: {
            reservation_id: 106,
            username: "sean1",
            reserved_items: { 2: 4, 3: 7, 4: 2 },
            order_time: "2021-03-25T08:04:05.000Z",
            estimated_pick_up: "2021-03-30T02:00:00.000Z",
            picked_up_time: null,
            approved: 0,
            cancelled: 0,
          },
          107: {
            reservation_id: 107,
            username: "sean1",
            reserved_items: { 1: 5, 2: 3, 3: 1, 4: 1 },
            order_time: "2021-03-25T08:04:11.000Z",
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

      showRsvnMsg: false, // show reservation message, default false
      selectedID: 1, // TODO: set a default ID so that it can run
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
      modalMessageHeader: "",
      modalBodyContent: "",
    });
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
      fontsize: "140%",
      fontWeight: "450",
    };

    const messageTimeStyle = {
      color: "--gray",
      textAlign: "right",
      fontSize: "60%",
      fontWeight: "300",
    };

    const username = <span style={usernameStyle}>{rsvn.username}</span>;

    const messageHeader = (
      <div>
        User {" " + username + " "} has reserved (xx) items at your food pantry!
        {/* Change messageTime according to API */}
        <p style={messageTimeStyle}>20 minutes ago.</p>
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
            onClick={() => {
              this.setState({ selectedID: rsvn_id }, this.openViewRsvnMsgModal);
            }}
          >
            View Message
          </Button>
          <Button variant="outline-primary">Mark as Picked up</Button>
          <Button variant="outline-danger">Cancel this reservation</Button>
        </ListGroupItem>
      )
    );
    return <ListGroup>{viewMessages}</ListGroup>;
  }

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
