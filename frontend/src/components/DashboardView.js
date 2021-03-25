import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PantryDescription from "./PantryDescription"

/**
 * Dashboard View 
 * 
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Jason Sutanto] (https://github.com/jsutanto19)
 */
class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state={
      pantryDesc: "We are UW food shed and we provide students of lower income households with food to eat"
      
    }
  }

  updateDesc(desc){
     this.setState({pantryDesc: desc})
  }
  
  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <h2>Dashboard</h2>
        </Row>
        <Row className="justify-content-center">
          <PantryDescription description={this.state.pantryDesc} updateDesc={this.updateDesc.bind(this)}/>
        </Row>
      </Container>
    );
  }
}

export default DashboardView;