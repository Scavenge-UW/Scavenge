import React, { Component } from "react";
import { Link } from "react-router-dom";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";

// imports for fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCircle } from "@fortawesome/free-solid-svg-icons";

// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchPantries } from "../../actions/pantryActions";

// other imports
import Fuse from "fuse.js";
import "../../css/ListView.css";

class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchedPantries: null,
      time: new Date(),
    };
    this.searchData = this.searchData.bind(this);
    this.renderHourCircle = this.renderHourCircle.bind(this);
  }

  componentDidMount() {
    this.props.fetchPantries();
  }

  searchData(pattern) {
    if (
      this.props.pantries.result !== null &&
      typeof this.props.pantries.result !== "undefined"
    ) {
      let pantries = [];
      Object.values(this.props.pantries.result).map((pantry) => {
        pantries.push(pantry);
      });

      if (!pattern) {
        this.setState({ matchedPantries: pantries });
        return;
      }

      // Perform fuzzy search for pantries
      const fuse = new Fuse(pantries, {
        keys: ["name", "city", "state", "address", "zip"],
        threshold: 0.3,
      });
      const result = fuse.search(pattern);

      if (!result.length) {
        // No matches
        this.setState({ matchedPantries: [] });
      } else {
        pantries = [];
        result.forEach(({ item }) => {
          pantries.push(item);
        });
        this.setState({ matchedPantries: pantries });
      }
    }
  }

  renderHourCircle(pantry) {
    const currDay = this.state.time.getDay();
    const currHour = this.state.time.getHours();
    const currMinute = this.state.time.getMinutes();

    let dayOfOperation = "";
    let open = "";
    let close = "";
    pantry.hours.forEach((hour) => {
      if (hour.day === parseInt(currDay)) {
        dayOfOperation = hour.day;
        open = hour.open;
        close = hour.close;
      }
    });
    const timeElementsClose = close.split(":");
    const pantryHourClose = timeElementsClose[0];
    const pantryMinuteClose = timeElementsClose[1];

    const timeElementsOpen = open.split(":");
    const pantryHourOpen = timeElementsOpen[0];
    const pantryMinuteOpen = timeElementsOpen[1];

    if (open === "00:00:00" && close === "00:00:00") {
      // Closed all day
      return <FontAwesomeIcon icon={faCircle} color="red" className="mr-3" />;
    } else if (currHour >= pantryHourOpen && currHour <= pantryHourClose) {
      // We're in the hour range, now handle edge cases
      if (currHour == pantryHourOpen) {
        if (currMinute >= pantryMinuteOpen) {
          return (
            <FontAwesomeIcon icon={faCircle} color="green" className="mr-3" />
          );
        } else {
          return (
            <FontAwesomeIcon icon={faCircle} color="red" className="mr-3" />
          );
        }
      } else if (currHour == pantryHourClose) {
        if (currMinute >= pantryMinuteClose) {
          return (
            <FontAwesomeIcon icon={faCircle} color="red" className="mr-3" />
          );
        } else {
          return (
            <FontAwesomeIcon icon={faCircle} color="green" className="mr-3" />
          );
        }
      } else {
        // Time is somewhere between the start hour and close hour so pantry is open!
        return (
          <FontAwesomeIcon icon={faCircle} color="green" className="mr-3" />
        );
      }
    } else {
      // Curr hour is above the closing hour or below opening hour, so closed
      return <FontAwesomeIcon icon={faCircle} color="red" className="mr-3" />;
    }
  }

  render() {
    let cards = [];
    if (
      this.state.matchedPantries !== null &&
      typeof this.state.matchedPantries !== "undefined"
    ) {
      this.state.matchedPantries.map((pantry) => {
        cards.push(
          <Card key={pantry.pantry_id}>
            <Card.Header className="d-inline align-middle card-header">
              <Accordion.Toggle
                as={Button}
                variant="link"
                eventKey={pantry.pantry_id}
              >
                <Row>
                  <Col md={2}>
                    <span>{this.renderHourCircle(pantry)}</span>
                  </Col>
                  <Col md={10} className="p-0">
                    <span className="pantry-link">{pantry.name}</span>
                  </Col>
                </Row>
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey={pantry.pantry_id}>
              <Card.Body>
                <strong>Address: </strong>
                {pantry.address}, {pantry.city}, {pantry.state}, {pantry.zip}
                <br></br>
                <strong>Website: </strong>
                {pantry.website}
                <br></br>
                <strong>Phone: </strong>
                {pantry.phone_number}
                <br></br>
                <Link to={"/pantries/" + pantry.pantry_id}>
                  <strong>Click here for details</strong>
                </Link>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      });
    } else {
      this.searchData(""); // Populate matchedPantries
    }

    return (
      <div className="search-wrapper">
        <h4 className="text-center">All Food Pantries</h4>
        <div className="Search">
          <input
            className="searchInput"
            type="text"
            onChange={(e) => this.searchData(e.target.value)}
            placeholder="Search by name or location"
          />
          <span className="SearchSpan">
            <FontAwesomeIcon className="pin" icon={faSearch} />
          </span>
        </div>
        <Accordion className="listGroup">{cards}</Accordion>
      </div>
    );
  }
}

// Make everything req
ListView.propTypes = {
  fetchPantries: PropTypes.func.isRequired,
  pantries: PropTypes.object,
};

// Takes in the state and returns an object
const mapStateToProps = (state) => ({
  pantries: state.pantries.pantries, // it's state.pantries because the index reducer specifies this reducer as 'pantries'
});

const mapFunctionToProps = {
  fetchPantries,
};

export default connect(mapStateToProps, mapFunctionToProps)(ListView);
