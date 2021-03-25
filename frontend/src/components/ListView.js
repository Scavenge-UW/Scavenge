import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Redux
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPantries } from '../actions/pantryActions';

import '../css/ListView.css';

class ListView extends Component {
  constructor(props) {
    super(props);  }

  componentDidMount() {
    this.props.fetchPantries();
  }

    
  render() {
    let cards = [];
    if (typeof this.props.pantries.result !== "undefined") {
      console.log(this.props.pantries.result);
      Object.values(this.props.pantries.result).map((pantry) => {
        cards.push(
            <Card>
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
    }

    return (
      <div>
        <h6 className="text-center">All Food Pantries</h6>
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