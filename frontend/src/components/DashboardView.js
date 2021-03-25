import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

/**
 * Dashboard View 
 * 
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */
class DashboardView extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <h2>Dashboard</h2>
        </Row>
        <Row className="justify-content-center">
          Reservations
        </Row>
      </Container>
    );
  }
}

export default DashboardView;