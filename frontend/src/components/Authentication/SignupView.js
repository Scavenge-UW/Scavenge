import React, { Component } from "react";
import { Col, Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class SignupView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      carDescription: "",
      type: "",
      email: "",
      phoneNumber: "",
    };
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm() {
    const user = {
      username: this.state.username,
      password: this.state.password,
      phoneNumber: this.state.phoneNumber,
      address: this.state.address,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      carDescription: this.state.carDescription,
      type: this.state.type,
      email: this.state.email,
    };

    if (this.state.username.length == 0 || this.state.password.length == 0) {
      alert("Username or password field is empty.");
      return;
    }

    this.props.signup(user);
  }

  render() {
    return (
      <Container>
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
                placeholder="Enter username"
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
              controlId="formGridCarDesc"
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
              <Form.Label>Car Description</Form.Label>
              <Form.Control
                type={"text"}
                value={this.state.carDescription}
                onChange={(e) =>
                  this.setState({ carDescription: e.target.value })
                }
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
                onChange={(e) => this.setState({ city: e.target.value })}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type={"text"}
                value={this.state.state}
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
                onChange={(e) => this.setState({ zip: e.target.value })}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group
              as={Col}
              controlId="formGridType"
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={this.state.type}
                onChange={(e) => this.setState({ type: e.target.value })}
              >
                <option>Choose</option>
                <option>Customer</option>
                <option>Staff</option>
                <option>Admin</option>
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Link
            to={{
              pathname: "/",
            }}
          >
            <Button
              variant="primary"
              style={{ marginLeft: "20px" }}
              onClick={this.submitForm}
            >
              Submit
            </Button>
          </Link>
        </Form>
      </Container>
    );
  }
}

export default SignupView;
