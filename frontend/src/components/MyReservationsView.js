import React, { Component } from "react";
import { Redirect } from "react-router-dom";
// import for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// import for components
import Dashboard_newMsg from "./Dashboard_newMsg";

// import for services
import ReservationService from "../services/reservation.service";
import PantryService from "../services/pantry.service";

// other imports
import { toast } from "react-toastify";
import formatters from "./formatters/DatetimeFormatter";

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
    this.state = { rsvns: [] };
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
        this.fetchResponse(); // push changes to be displayed by re-rendered
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

    const numReservation = [...this.state.rsvns].filter(
      (rsvn) => formatters.getTimeElapsed(rsvn.order_time, "days") < 7
    ).length;

    return (
      <Container>
        {/* page title */}
        <Row className="justify-content-center">
          <h2>My Reservations</h2>
        </Row>
        {/* overview message */}
        <Row className="justify-content-center">
          You have made {numReservation} reservations this week.
        </Row>

        <Dashboard_newMsg
          adminMode={false}
          rsvns={this.state.rsvns}
          username={this.props.username}
          markWithDraw={(pantry_id, rsvn_id) =>
            this.markWithDraw(pantry_id, rsvn_id)
          }
        />
      </Container>
    );
  }
}

export default MyReservationsView;
