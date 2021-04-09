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
      pantry_id: "", // TODO: Change to actual pantry id
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
      // these are needed but not sure if we want to edit this data
      img_src: "",
      lat: "",
      lon: "",
    };
  }

  componentDidMount() {
    console.log("componentDidMount!!");
    const pantry = this.props.pantryDetail;

    if (pantry) {
      console.log(pantry);
      this.setState(
        {
          pantry_id: pantry.pantry_id,
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
          img_src: pantry.img_src,
          lat: pantry.lat,
          lon: pantry.lon,
        },
        () => this.getDashboardOverview() // TODO: not sure if this is needed.
      );
    }
  }

  // ************************************************************************
  // ************************ DashboardMessages *****************************
  // ************************************************************************
  /**
   * Mark a reservation as approved
   *
   * @param {*} rsvn_id
   */
  markAsApproved(rsvn_id) {
    console.log(rsvn_id);

    PantryService.setApproved(this.state.pantry_id, rsvn_id)
      .then(() => {
        this.props.fetchPantryDetail();
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
   */
  markAsPickedUp(rsvn_id) {
    console.log(rsvn_id);
    PantryService.setPickedUp(this.state.pantry_id, rsvn_id)
      .then(() => {
        this.props.fetchPantryDetail();
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
   */
  markAsCancelled(rsvn_id) {
    console.log(rsvn_id);
    PantryService.setCancelled(this.state.pantry_id, rsvn_id)
      .then(() => {
        this.props.fetchPantryDetail();
        toast.success(
          "You have successfully cancelled the reservation with ID " + rsvn_id
        );
      })
      .catch(() => {
        toast.error("Error while cancelling reservation with ID " + rsvn_id);
      });
  }

  // ************************************************************************
  // ******************* DashboardDescriptionCard.js ************************
  // ************************************************************************

  updateAll(updates) {
    this.setState({
      description: updates[0],
      address: updates[1],
      zipcode: updates[2],
      city: updates[3],
      stte: updates[4],
      phone: updates[5],
      weblink: updates[6],
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
            pantry_id={this.state.pantry_id}
            pantryName={this.state.pantryName}
            description={this.state.description}
            address={this.state.address}
            zipcode={this.state.zipcode}
            city={this.state.city}
            stte={this.state.stte}
            phone={this.state.phone}
            weblink={this.state.weblink}
            updateAll={this.updateAll.bind(this)}
            img_src={this.state.img_src}
            lat={this.state.lat}
            lon={this.state.lon}
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
            // pantry_id={this.state.pantry_id}
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
