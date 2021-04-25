import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// imports for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// imports for components
import Dashboard_newMsg from "../components_shared/Dashboard_newMsg";

// imports for services
import ReservationService from "../../services/reservation.service";
import PantryService from "../../services/pantry.service";

// other imports
import { toast } from "react-toastify";

// imports for helper functions
import MySpinner from "../helper_functions/MySpinner";
import formatters from "../helper_functions/DatetimeFormatter.function";

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
    this.state = { rsvns: [], loaded: false };
  }

  componentDidMount() {
    this.fetchResponse();
  }

  fetchResponse() {
    // const response = ReservationService.getUserReservations(
    ReservationService.getUserReservations(this.props.username).then(
      (response) => {
        this.setState({
          rsvns: response.reservations,
          loaded: true,
        });
      }
    );
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

  myReservationOverview() {
    const numReservation = [...this.state.rsvns].filter(
      (rsvn) => formatters.getTimeElapsed(rsvn.order_time, "days") < 7
    ).length;

    return (
      <>
        {/* page title */}
        <Row className="justify-content-center mt-4">
          <h2>My Reservations</h2>
        </Row>
        <hr />
        {/* overview message */}
        <Row className="justify-content-center mt-4">
          <h6>
            You have made {numReservation} reservations in the last 7 days.
          </h6>
        </Row>
        <Row className="justify-content-center">
          <h6>
            Here are your {numReservation >= 5 ? 5 : numReservation} most recent
            reservations.
          </h6>
        </Row>
      </>
    );
  }

  /**
   * Renders components.
   *
   */
  render() {
    if (!this.props.username) {
      return <Redirect push to="/login" />;
    }
    if (this.state.loaded) {
      return (
        <Container id="my-reservation">
          {this.myReservationOverview()}
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
    } else {
      return (
        <Container id="my-reservation-loading">
          <MySpinner />
        </Container>
      );
    }
  }
}

export default MyReservationsView;
