import React, { Component } from "react";

// import for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { ListGroup, ListGroupItem, ListGroupItemHeading } from "reactstrap";

// import for components
import DashboardMessages from "./DashboardMessages";
import DashboardDescriptionCard from "./DashboardDescriptionCard";
import DashboardOpenHourCard from "./DashboardOpenHourCard";
// import DashboardMessage from "./DashboardMessage";

// import for services
import PantryService from "../services/pantry.service";

// other imports
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
    };
  }

  componentDidMount() {
    console.log("componentDidMount!!");
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

  /**
   * Mark a reservation as approved
   *
   * @param {*} rsvn_id
   * @param {*} pantry_id
   */
  markAsApproved(rsvn_id, pantry_id) {
    console.log(rsvn_id);

    // refresh the page to display the updated state
    // const reload = () => window.location.reload();

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
   * Mark a reservation as picked up
   *
   * @param {*} rsvn_id
   * @param {*} pantry_id
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
   *  Mark a reservation as cancelled
   *
   * @param {*} rsvn_id
   * @param {*} pantry_id
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
   * Returns the textual description of the current dashboard.
   *
   * @returns
   */
  getDashboardOverview() {
    const numReservation = Object.keys(this.state.rsvns).length;

    return (
      <>
        {/* Page title */}
        <Row className="justify-content-center">
          <h3>Dashboard</h3>
        </Row>
        <hr />
        {/* Overview message */}
        <Row className="justify-content-center">
          You have {numReservation} new reservations today.
        </Row>
      </>
    );
  }

  /**
   *
   * @returns
   */
  getDescriptionCards() {
    return (
      <>
        <Row className="justify-content-center pt-4">
          <DashboardDescriptionCard
            adminMode
            pantryName={this.state.pantryName}
            description={this.state.description}
            address={this.state.address}
            zipcode={this.state.zipcode}
            city={this.state.city}
            stte={this.state.stte}
            phone={this.state.phone}
            weblink={this.state.weblink}
          />
        </Row>
      </>
    );
  }

  /**
   *
   * @returns
   */
  getMessageAndFunctions() {
    return (
      <>
        {/* Sub-session title */}
        <Row className="justify-content-center">
          <h4>Messages </h4>
        </Row>
        {/* Sub-session content (TODO: adjust style) */}
        <Row className="justify-content-center">
          <DashboardMessages
            adminMode
            rsvns={this.state.rsvns}
            fetchPantryDetail={this.props.fetchPantryDetail}
            markAsApproved={this.markAsApproved.bind(this)}
            markAsPickedUp={this.markAsPickedUp.bind(this)}
            markAsCancelled={this.markAsCancelled.bind(this)}
          />
        </Row>
      </>
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
        {/* dashboard and dashboard messages */}
        {this.getDashboardOverview()}

        {/* messages displayed and buttons for actions */}
        {this.getMessageAndFunctions()}

        {/* pantry description card and edits */}
        {this.getDescriptionCards()}

        {/* Open Hours */}
        <Row className="justify-content-center pt-4">
          <DashboardOpenHourCard openHours={this.state.hours} />
        </Row>
      </Container>
    );
  }
}

export default DashboardView;
