import React, { Component } from "react";

// import for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// import for components
import Dashboard_newMsg from "./Dashboard_newMsg";
import DashboardDescriptionCard from "./DashboardDescriptionCard";
import DashboardOpenHourCard from "./DashboardOpenHourCard";
import formatters from "./helper_functions/DatetimeFormatter.function";

// import for services
import PantryService from "../services/pantry.service";

// other imports
import { toast } from "react-toastify";
import MySpinner from "./helper_functions/MySpinner";

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
      pantry_id: null, // TODO: Change to actual pantry id
      pantryName: "",
      rsvns: [],
      description: "",
      address: "",
      zipcode: "",
      city: "",
      stte: "",
      phone: "",
      weblink: "",
      // these are needed for 'DashboardDescription Card
      // but not sure if we want to edit this data
      img_src: "",
      lat: "",
      lon: "",

      // used by DashboardOpenHourCard
      hours: [],
    };
  }

  componentDidMount() {
    const pantry = this.props.pantryDetail;

    if (pantry) {
      this.setState({
        pantry_id: pantry.pantry_id,
        pantryName: pantry.name,
        rsvns: pantry.reservations,
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
        hours: pantry.hours,
      });
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
        this.props.fetchPantryDetail(); // push changes to be displayed by re-rendered
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
        this.props.fetchPantryDetail(); // push changes to be displayed by re-rendered
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
        this.props.fetchPantryDetail(); // push changes to be displayed by re-rendered
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

  /**
   * Update pantry detail for state
   *
   * @param {*} updates - contains description, address, zipcode, city, state,
   *                      phone, and link to pantry's website
   */
  updateAllDetails(updates) {
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

  // ************************************************************************
  // ******************* DashboardOpenHourCards *****************************
  // ************************************************************************
  /**
   * Update pantry open hour for state
   * @param {*} updDay - the day that is updated (e.g. Monday, etc)
   * @param {*} updates - updates made by user (e,g. updates on open, close hours, and details)
   */
  updateOpenHours(updDay, updates) {
    this.state.hours.map((item) => {
      if (item.day === updDay) {
        item.open = updates[0];
        item.close = updates[1];
        item.detail = updates[2];
      }
    });
    this.setState({
      hours: this.state.hours,
    });
  }

  // ************************************************************************
  // ******************* render helper functions ****************************
  // ************************************************************************

  /**
   * Returns the textual description of the current dashboard.
   *
   * @returns
   */
  getDashboardOverview() {
    const numReservation = [...this.state.rsvns].filter(
      (rsvn) => formatters.getTimeElapsed(rsvn.order_time, "hours") < 24
    ).length;

    return (
      <>
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
          <h6>You have {numReservation} new reservations today.</h6>
        </Row>
      </>
    );
  }

  /**
   * render component for message box.
   */
  getMessageAndFunctions() {
    return (
      <Dashboard_newMsg
        adminMode={true}
        pantry_id={this.state.pantry_id}
        rsvns={this.state.rsvns}
        markAsApproved={this.markAsApproved.bind(this)}
        markAsPickedUp={this.markAsPickedUp.bind(this)}
        markAsCancelled={this.markAsCancelled.bind(this)}
      />
    );
  }

  /**
   * render component for description card.
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
            updateAllDetails={this.updateAllDetails.bind(this)}
            img_src={this.state.img_src}
            lat={this.state.lat}
            lon={this.state.lon}
          />
        </Row>
      </>
    );
  }

  /**
   * renders components for open hours card.
   */
  getOpenHoursCards() {
    return (
      <Row className="justify-content-center pt-4">
        <Card bg="light" className="w-responsive w-75 text-center mx-auto mt-2">
          <Card.Header as="h5">
            {/* TODO: fix */}
            <Row className="justify-content-between align-items-center">
              <Col className="text-left">Operating Hours</Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Card.Title>{this.state.pantryName}</Card.Title>
            <hr />
            <Row className="w-responsive w-100">
              {this.state.hours.map((item) => (
                <DashboardOpenHourCard
                  adminMode
                  pantry_id={this.state.pantry_id}
                  day={item.day}
                  open={item.open}
                  close={item.close}
                  detail={item.detail}
                  updateOpenHours={(updDay, updates) =>
                    this.updateOpenHours(updDay, updates)
                  }
                />
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Row>
    );
  }

  /**
   * Renders components.
   *
   */
  render() {
    if (this.state.pantry_id) {
      return (
        <Container id="dashboard-view-loading">
          {/* dashboard and dashboard messages */}
          {this.getDashboardOverview()}

          {/* messages displayed and buttons for actions */}
          {this.getMessageAndFunctions()}

          {/* pantry description card and edits */}
          {this.getDescriptionCards()}

          {/* Open Hours */}
          {this.getOpenHoursCards()}

          <Row className="justify-content-center">
            <p className="mt-4">
              Time is Money. We provide an efficient way for you to update
              available items.
            </p>
          </Row>
        </Container>
      );
    }
    return (
      <Container id="dashboard-view-loading">
        <MySpinner />
      </Container>
    );
  }
}

export default DashboardView;
