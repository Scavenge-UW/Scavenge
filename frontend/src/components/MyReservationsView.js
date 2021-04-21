import React, { Component } from "react";
import { Redirect } from "react-router-dom";
// import for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// import for components
import DashboardMessages_New from "./DashboardMessages_New";

// import for services
import ReservationService from "../services/reservation.service";
import PantryService from "../services/pantry.service";

// other imports
import { toast } from "react-toastify";

/**
 * MyReservationsView
 * A view where civilian users can see reservations they made
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 *
 */
class MyReservationsView extends Component {
  constructor(props) {
    super(props);
    this.state = { rsvns: [], weblink: "" };
  }

  componentDidMount() {
    const response = ReservationService.getUserReservations(
      this.props.username
    ).then((response) => {
      this.setState({
        rsvns: response.reservations,
      });
    });
    // TODO: load website link for each pantry (to be used in DashboardMessage, and will be shown in My Reservation page)
    PantryService.getDetail();
  }

  // TODO: action not functioning
  /**
   *  Mark a reservation as cancelled
   *
   * @param {*} rsvn_id
   */
  markAsCancelled(rsvn_id) {
    console.log(rsvn_id);
    PantryService.setCancelled(this.state.pantry_id, rsvn_id)
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
   * Renders components.
   *
   */
  render() {
    if (!this.props.username) {
      return <Redirect push to="/login" />;
    }
    return (
      <Container>
        {/* Pantry's name */}
        <Row className="justify-content-center">
          <h2>My Reservations</h2>
        </Row>

        <DashboardMessages_New
          // pantry_id={this.state.pantry_id}
          rsvns={this.state.rsvns}
          weblink={this.state.weblink}
          // fetchPantryDetail={this.props.fetchPantryDetail}
          // markAsApproved={this.markAsApproved.bind(this)}
          // markAsPickedUp={this.markAsPickedUp.bind(this)}
          markAsCancelled={this.markAsCancelled.bind(this)}
        />
      </Container>
    );
  }
}

export default MyReservationsView;
