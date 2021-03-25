import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Redux
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPantries } from '../actions/pantryActions';

class ListView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPantries();
    console.log(this.props.pantries);
  }

  render() {
    return (
      <Container>
        <h1>Hi from list</h1>
      </Container>
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