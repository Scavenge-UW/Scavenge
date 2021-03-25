import React, { Component } from "react";
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

const initReservedList = {};

/**
 * Dashboard View
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */
class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * Dummy Reseravtion examples.
       * TODO: fetch actual reservations from the API or use Socket.io?
       */
      reservationMessages: [
        {
          user_id: 1,
          user_firstname: "Andy",
          user_lastname: "Lin",
          reserved_items: {
            Apple: 4,
            Tomato: 3,
            Banana: 1,
          },
        },
        {
          user_id: 2,
          user_firstname: "Ilkyu",
          user_lastname: "Ju",
          reserved_items: {
            Pineapple: 2,
            Beef: 1,
            Banana: 1,
          },
        },
        {
          user_id: 3,
          user_firstname: "Jason",
          user_lastname: "Sutanto",
          reserved_items: {
            Toast: 1,
            Apple: 5,
            Pineapple: 2,
            Beef: 1,
          },
        },
      ],
      showRsvnMsg: false, // show reservation message, default false
      reservedItemForUser: initReservedList,
    };
  }

  /**
   * Returns the textual description of the current inventory.
   *
   */
  getDashboardOverview() {
    let numReservation = this.state.reservationMessages.length;

    return (
      <p className="text-center mt-4">
        You have {numReservation} new reservations today.
      </p>
    );
  }

  /**
   * @returns the message header (title and reservation time) for each message
   *          and initialize reservedItemForUser in the state for the user.
   */
  getItemHeadingMessage(user_id) {
    let firstname;
    let lastname;
    let numItems;
    const messageTime = {
      color: "--gray",
      textAlign: "right",
      fontSize: "60%",
      fontWeight: "300",
    };

    this.state.reservationMessages.forEach((info) => {
      if (info.user_id === user_id) {
        firstname = info.user_firstname;
        lastname = info.user_lastname;
        numItems = Object.keys(info.reserved_items).length;
        this.state.reservedItemForUser = info.reserved_items;
      }
    });

    console.log(
      "this.state.reservedItemForUser are: ",
      this.state.reservedItemForUser
    ); // debug-remove

    return (
      <div>
        {firstname} {lastname} has reserved {numItems} items at your food
        pantry!
        {/* Change messageTime according to API */}
        <p style={messageTime}>3 days ago.</p>
      </div>
    );
  }

  /**
   * Iteratively returns messages according to the number of reservations received.
   *
   */
  getMessageOverview() {
    console.log("getMessageOverview"); // debug-remove
    return (
      <ListGroup>
        {this.state.reservationMessages.map((value, key) => {
          return (
            <ListGroupItem tag="a" href="#" action>
              {/* Heading */}
              <ListGroupItemHeading key={key} className="mb-1">
                {this.getItemHeadingMessage(value.user_id)}
              </ListGroupItemHeading>

              {/* Button for View Reservation Message Modal */}
              <ViewRsvnMsgModal
                show={this.state.showRsvnMsg}
                messageContent={this.state.reservedItemForUser}
              />
              <Button variant="outline-primary">Mark as Picked up</Button>
              <Button variant="outline-danger">Cancel this reservation</Button>
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
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
        <Row>
          <h4>Messgaes </h4>
        </Row>

        <Row>{this.getMessageOverview()}</Row>
      </Container>
    );
  }
}

export default DashboardView;
