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

// const initReservedList = {};

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
      foodPantryDescription:
        "Default Description. Elit voluptate labore" +
        "amet ad eu mollit aliquip anim incididunt " +
        "deserunt irure. Fugiat deserunt officia ad" +
        "officia. Ullamco aliqua non nostrud duis" +
        "adipisicing laboris aliqua sunt sint ullamco" +
        "mollit adipisicing. In nostrud anim voluptate eu.",

      foodPantryDefaultOpenHours: "Monday 3PM - 9PM, Wednesday 9AM - 11AM",

      showRsvnMsg: false, // show reservation message, default false
      // reservedItemForUser: initReservedList,
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
      // reservedItemForUser: initReservedList,
    });
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
      // for (let info of this.state.reservationMessages) {
      if (info.user_id === user_id) {
        console.log("info.user_id = %d, user_id = %d", info.user_id, user_id);
        firstname = info.user_firstname;
        lastname = info.user_lastname;
        numItems = Object.keys(info.reserved_items).length;
        // this.state.reservedItemForUser = info.reserved_items;
      }
    });
    // }

    return (
      <div>
        {firstname} {lastname} has reserved {numItems} items at your food
        pantry!
        {/* Change messageTime according to API */}
        <p style={messageTime}>20 minutes ago.</p>
      </div>
    );
  }

  // getReservationItems(user_id) {
  //   let content = "";
  //   for (let info of this.state.reservationMessages) {
  //     if (info.user_id === user_id) {
  //       // this.state.reservedItemForUser = info.reserved_items;
  //       Object.entries(info.reserved_items).map(
  //         ([key, value]) => (content += `${key}: ${value} \n`)
  //       );
  //     }
  //   }

  //   console.log("content = ", content);
  //   return content;
  // }

  /**
   * Iteratively returns messages according to the number of reservations received.
   *
   */
  getMessageOverview() {
    return (
      <ListGroup>
        {this.state.reservationMessages.map((value, key) => {
          return (
            <ListGroupItem tag="a" action>
              {/* Heading */}
              <ListGroupItemHeading key={key} className="mb-1">
                {this.getItemHeadingMessage(value.user_id)}
              </ListGroupItemHeading>

              {/* Button */}
              <Button
                variant="outline-info"
                onClick={() => {
                  this.openViewRsvnMsgModal();
                }}
              >
                View Message
              </Button>

              {/* <ListGroupItemText></ListGroupItemText> */}

              {/* Model for View Reservation Message*/}
              <ViewRsvnMsgModal
                show={this.state.showRsvnMsg}
                onHide={() => {
                  this.closeViewRsvnMsgModal();
                }}
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
        <Row className="justify-content-center">
          <h4>Messgaes </h4>
        </Row>

        <Row className="justify-content-center" xs="2">
          {this.getMessageOverview()}
        </Row>
      </Container>
    );
  }
}

export default DashboardView;
