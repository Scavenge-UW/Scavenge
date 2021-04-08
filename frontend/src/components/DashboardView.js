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

  /////////////////////////////////////////////////////////////////////////////
  //////////////////////////// Reservation Message ////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  /**
   * Returns the textual description of the current dashboard.
   *
   */
  getDashboardOverview() {
    const numReservation = Object.keys(this.state.rsvns).length;

    return (
      <p className="text-center mt-4">
        You have {numReservation} new reservations today.
      </p>
    );
  }

  /////////////////////////////////////////////////////////////////////////////
  //////////////////////////// Pantry Description /////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  /**
   *
   */
  getDescriptionCards() {
    return (
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
    );
  }

  getMessageAndFunctions() {
    return <DashboardMessages adminMode rsvns={this.state.rsvns} />;
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
        {/* Page title */}
        <Row className="justify-content-center">
          <h3>Dashboard</h3>
        </Row>
        <hr />
        {/* Overview message */}
        <Row className="justify-content-center">
          {this.getDashboardOverview()}
        </Row>
        {/* Sub-session title */}
        <Row className="justify-content-center">
          <h4>Messages </h4>
        </Row>
        {/* Sub-session content (TODO: adjust style) */}
        <Row className="justify-content-center">
          {this.getMessageAndFunctions()}
        </Row>
        {/* TODO: add changes
        <Row className="justify-content-center">
          <DashboardMessage />
        </Row> */}
        {/* Description */}
        <Row className="justify-content-center pt-4">
          {this.getDescriptionCards()}
        </Row>
        {/* Open Hours */}
        <Row className="justify-content-center pt-4">
          <DashboardOpenHourCard openHours={this.state.hours} />
        </Row>
      </Container>
    );
  }
}

export default DashboardView;
