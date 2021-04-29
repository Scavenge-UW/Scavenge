import React, { Component, createRef } from "react";

// import for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

// import for components
import Dashboard_newMsg from "./Dashboard_newMsg";
import DashboardDescriptionCard from "../components_admin/DashboardDescriptionCard";
import DashboardOpenHourCard from "../components_admin/DashboardOpenHourCard";
import FooterMsg from "../helper_functions/FooterMsg";
import formatters from "../helper_functions/DatetimeFormatter.function";

// import for services
import PantryService from "../../services/pantry.service";

// other imports
import { toast } from "react-toastify";
import MySpinner from "../helper_functions/MySpinner";
import msgFunctions from "../helper_functions/msgAndBtns.function"; // message helper functions

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

    // used by admin who is emplpoyee of multiple pantries
    this.currentPantryName = createRef();

    const pantry = this.props.pantryDetail;
    this.state = {
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
      // these are needed for 'DashboardDescription Card
      // but not sure if we want to edit this data
      img_src: pantry.img_src,
      lat: pantry.lat,
      lon: pantry.lon,

      // time to add
      timeToAdd: pantry.time_to_add,

      // used by DashboardOpenHourCard
      hours: pantry.hours,
    };
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
      img_src: updates[7],
      timeToAdd: updates[8],
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
          {/* <h2>{this.state.pantryName}</h2> */}
          <Form.Group controlId="pantry-manage-form">
            <Form.Label>
              <h2>{this.state.pantryName}</h2>
            </Form.Label>
            <Form.Control
              as="select"
              ref={this.currentPantryName}
              disabled={this.props.employeeOf.length < 2}
              defaultValue={this.state.pantryName}
            >
              <option>{this.state.pantryName}</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Form.Control>
          </Form.Group>
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
        timeToAdd={this.state.timeToAdd}
        pantryDetail={this.pantry}
        fetchPantryDetail={() => this.props.fetchPantryDetail()}
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
            time_to_add={this.state.timeToAdd}
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
            <FooterMsg />
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
