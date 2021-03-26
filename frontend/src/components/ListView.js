import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Redux
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPantries } from '../actions/pantryActions';

import Fuse from "fuse.js";

import '../css/ListView.css';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';

class ListView extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      matchedPantries: null
    }
    this.searchData = this.searchData.bind(this);
  }

  componentDidMount() {
    this.props.fetchPantries();
  }

  searchData(pattern) {
    if (this.props.pantries.result !== null && typeof (this.props.pantries.result) !== "undefined") {
      let pantries = [];
      //console.log(this.props.pantries);
      Object.values(this.props.pantries.result).map((pantry) => {
        pantries.push(pantry);
      });
  
      if (!pattern) {
        //console.log("HRE1")
        this.setState({ matchedPantries: pantries });
        return;
      }
  
      // Perform fuzzy search for pantries
      const fuse = new Fuse(pantries, {
        keys: ["name", "city", "state", "phone_number", "address", "zip"],
      });
      const result = fuse.search(pattern);
  
      if (!result.length) {
        // No matches
        //console.log("HRE3");
        this.setState({ matchedPantries: [] });
      } else {
        pantries = [];
        result.forEach(({item}) => {
          pantries.push(item);
        });
        this.setState({ matchedPantries: pantries });
        //console.log(this.state.matchedPantries);
      }
    }
  }
    
  render() {
    let cards = [];
    if (this.state.matchedPantries !== null && typeof this.state.matchedPantries !== "undefined") {
      this.state.matchedPantries.map((pantry) => {
        cards.push(
            <Card key={pantry.pantry_id}>
              <Card.Header className="text-center">
                <Accordion.Toggle as={Button} variant="link" eventKey={pantry.pantry_id}>
                  {pantry.name}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={pantry.pantry_id}>
                <Card.Body>
                  <strong>Address: </strong>{pantry.address}, {pantry.city}, {pantry.state}, {pantry.zip}
                  <br></br>
                  <strong>Website: </strong>{pantry.website}
                  <br></br>
                  <strong>Phone: </strong>{pantry.phone_number}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
        );
      }); 
    } else {
      this.searchData(""); // Populate matchedPantries
    }

    return (
      <div>
        <h6 className="text-center">All Food Pantries</h6>
        <div className="Search">
          <span className="SearchSpan">
            <FontAwesomeIcon className="pin" icon={faSearch}/>
          </span>
          <input
            className="SearchInput"
            type="text"
            onChange={(e) => this.searchData(e.target.value)}
            placeholder="UW Food Shed"
          />
        </div>
        <Accordion className="listGroup">
          {cards}
        </Accordion>
      </div>
    );
  }
}

// Make everything req
ListView.propTypes = {
  fetchPantries: PropTypes.func.isRequired,
  pantries: PropTypes.object
}

// Takes in the state and returns an object
const mapStateToProps = (state) => ({
  pantries: state.pantries.pantries, // it's state.pantries because the index reducer specifies this reducer as 'pantries'
});

const mapFunctionToProps = {
  fetchPantries
}


export default connect(mapStateToProps, mapFunctionToProps)(ListView);