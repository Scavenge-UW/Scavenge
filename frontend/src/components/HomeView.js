import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import img from '../images/home.jpg'

class HomeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <h1 className="view-header text-center mb-3">Welcome to Scavenge</h1>
        <Row className="justify-content-between align-items-center">
          <Image src = {img} />
        </Row>
      </Container>
    );
  }
}

export default HomeView;
