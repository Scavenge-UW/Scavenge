import React, { Component } from 'react';
import { Col, Form, Button, Container } from "react-bootstrap";
import { connect } from 'react-redux';
import { editProf } from '../actions/profileAction';
import PropTypes from 'prop-types';
import "bootstrap/dist/css/bootstrap.css";


class profileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "username": '',
      "password": '',
      "phone": '',
      "address": '',
      "city": '',
      "state": '',
      "zip": '',
      "email": '',
      "first_name": '',
      "last_name": ''
    };

  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
          "username": this.state.username,
          "password": this.state.password,
          "phone": this.state.phone,
          "address": this.state.address,
          "city": this.state.city,
          "state": this.state.state,
          "zip": this.state.zip,
          "email": this.state.email,
          "firstName": this.state.first_name,
          "lastName": this.state.last_name
    };
    if(this.state.username && this.state.password){
      this.props.editProf(user);
    } else{
      alert("Username or password field is empty.")
    }
  }
  
  
    render() {
      return (
        <Container>
          <h1>Edit Your Account</h1>
          <Form>
            <Form.Row>
              <Form.Group
                as={Col}
                controlId="formGridEmail"
                style={{ paddingTop: "10px", paddingLeft: "20px" }}
              >
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type={"text"}
                  placeholder={"Username"}
                  value={this.state.username}
                  onChange={(e) => this.setState({ username: e.target.value })}
                />
              </Form.Group>
  
              <Form.Group
                as={Col}
                controlId="formGridPassword"
                style={{
                  paddingTop: "10px",
                  paddingLeft: "10px",
                  paddingRight: "20px",
                }}
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={"password"}
                  placeholder="Password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group
                as={Col}
                controlId="formfirstName"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type={"text"}
                  placeholder="John"
                  value={this.state.first_name}
                  onChange={(e) => this.setState({ first_name: e.target.value })}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group
                as={Col}
                controlId="formLastName"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type={"text"}
                  placeholder="Example"
                  value={this.state.last_name}
                  onChange={(e) => this.setState({ last_name: e.target.value })}
                />
              </Form.Group>
            </Form.Row>


            <Form.Row>
              <Form.Group
                as={Col}
                controlId="formGridAddress1"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type={"text"}
                  placeholder="1234 Main St"
                  value={this.state.address}
                  onChange={(e) => this.setState({ address: e.target.value })}
                />
              </Form.Group>
            </Form.Row>
  
            <Form.Row>
              <Form.Group
                as={Col}
                controlId="formControlsEmail"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type={"email"}
                  placeholder="john@example.com"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </Form.Group>
            </Form.Row>
  
            <Form.Row>
              <Form.Group
                as={Col}
                controlId="formControlsPhone"
                style={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type={"text"}
                  value={this.state.phoneNumber}
                  placeholder="(123) 456 7890"
                  onChange={(e) =>
                    this.setState({ phoneNumber: e.target.value })
                  }
                />
              </Form.Group>
            </Form.Row>
  
            <Form.Row>
              <Form.Group
                as={Col}
                controlId="formGridCity"
                style={{ paddingLeft: "20px" }}
              >
                <Form.Label>City</Form.Label>
                <Form.Control
                  type={"text"}
                  value={this.state.city}
                  placeholder="City"
                  onChange={(e) => this.setState({ city: e.target.value })}
                />
              </Form.Group>
  
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type={"text"}
                  value={this.state.state}
                  placeholder="State"
                  onChange={(e) => this.setState({ state: e.target.value })}
                />
              </Form.Group>
  
              <Form.Group
                as={Col}
                controlId="formGridZip"
                style={{ paddingRight: "20px" }}
              >
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type={"number"}
                  value={this.state.zip}
                  placeholder="Zipcode"
                  onChange={(e) => this.setState({ zip: e.target.value })}
                />
              </Form.Group>
            </Form.Row>
            
        
            <Button
              variant="primary"
              style={{ marginLeft: "20px" }}
              onClick={this.submitForm}
            >
              Submit
            </Button>
            <Button
              variant="danger"
              style={{ marginLeft: "20px" }}
              onClick={this.submitForm}
            >
              Cancel
            </Button>
          </Form>
        </Container>
      ); 

    }
  }

  profileView.propTypes = {
    editProf: PropTypes.func.isRequired
  };
  
  export default connect(null, {editProf})(profileView);
