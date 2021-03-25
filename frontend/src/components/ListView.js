import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

// Redux
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPantries } from '../actions/pantryActions';

import '../css/ListView.css';

class ListView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPantries();
  }

  
  // render() {
  //   return (
  //     <div className="Container">
  //       {this.props.pantries.result.map((pantry) => {
          
  //       })}
  //     </div>
  //   );
  // }

    
  render() {
    return (
      <div>
        <h6 className="text-center">All Food Pantries</h6>
        <ListGroup className="listGroup">
          <ListGroup.Item action>
            Link 1
          </ListGroup.Item>
          <ListGroup.Item action>
            Link 2
          </ListGroup.Item>
          <ListGroup.Item action>
            This one is a button
          </ListGroup.Item>
          <ListGroup.Item action>
          This one is a button
        </ListGroup.Item> <ListGroup.Item action>
        This one is a button
      </ListGroup.Item> <ListGroup.Item action>
      This one is a button
    </ListGroup.Item> <ListGroup.Item action>
    This one is a button
  </ListGroup.Item> <ListGroup.Item action>
  This one is a button
</ListGroup.Item> <ListGroup.Item action>
This one is a button
</ListGroup.Item> <ListGroup.Item action>
This one is a button
</ListGroup.Item> <ListGroup.Item action>
This one is a button
</ListGroup.Item> <ListGroup.Item action>
This one is a button
</ListGroup.Item> <ListGroup.Item action>
This one is a button
</ListGroup.Item> <ListGroup.Item action>
This one is a button
</ListGroup.Item>
        </ListGroup>
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