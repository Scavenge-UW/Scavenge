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
 * @author [Yayen Lin](https://github.com/yayen-lin)
 *
 */
class MyReservationsView extends Component {
  constructor(props) {
    super(props);
    this.state = { rsvns: [], weblink: "" };
  }

  componentDidMount() {
    this.fetchResponse();
  }

  fetchResponse() {
    const response = ReservationService.getUserReservations(
      this.props.username
    ).then((response) => {
      this.setState({
        rsvns: response.reservations,
      });
    });
  }

  /**
   *  Mark a reservation as cancelled
   *
   * @param {*} rsvn_id
   */
  markWithDraw(pantry_id, rsvn_id) {
    console.log(rsvn_id);
    PantryService.setCancelled(pantry_id, rsvn_id)
      .then(() => {
        this.fetchResponse();
        toast.success(
          "You have successfully withdrawed your reservation with ID " + rsvn_id
        );
      })
      .catch(() => {
        toast.error(
          "Error while withdrawing your reservation with ID " + rsvn_id
        );
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

    console.log({ ...this.state.rsvns });

    return (
      <Container>
        {/* Pantry's name */}
        <Row className="justify-content-center">
          <h2>My Reservations</h2>
        </Row>

        <DashboardMessages_New
          adminMode={false}
          rsvns={this.state.rsvns}
          markWithDraw={(pantry_id, rsvn_id) =>
            this.markWithDraw(pantry_id, rsvn_id)
          }
        />
      </Container>
    );
  }
}

export default MyReservationsView;
