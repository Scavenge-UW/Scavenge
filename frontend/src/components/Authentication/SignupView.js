import React, { Component } from "react";
import { Col, Form, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

class SignupView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      email: "",
      type: "",
      toHomeView: "", // used for redirection on signup success
    };
    this.submitForm = this.submitForm.bind(this);
  }

  async submitForm() {
    const user = {
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      address: this.state.address,
      state: this.state.state,
      city: this.state.city,
      zipcode: this.state.zipcode,
      email: this.state.email,
    };

    if (
      this.state.username.length == 0 ||
      this.state.password.length == 0 ||
      this.state.phoneNumber.length == 0 ||
      this.state.address.length == 0 ||
      this.state.city.length == 0 ||
      this.state.state.length == 0 ||
      this.state.city.length == 0 ||
      this.state.zip.length == 0 ||
      this.state.email.length == 0
    ) {
      alert("Username or password field is empty.");
      return;
    }

    let signupResult = await this.props.signup(user);
    if (signupResult === 0) {
      // Successful signup
      this.setState({
        toHomeView: true,
      });
    }
  }

  render() {
    if (this.state.toHomeView === true) {
      return <Redirect to="/" />;
    }

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
              controlId="formGridFirstName"
              style={{ paddingTop: "10px", paddingLeft: "20px" }}
            >
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type={"text"}
                placeholder="John"
                value={this.state.firstName}
                onChange={(e) => this.setState({ firstName: e.target.value })}
              />
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="formGridLastName"
              style={{
                paddingTop: "10px",
                paddingLeft: "10px",
                paddingRight: "20px",
              }}
            >
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type={"text"}
                placeholder="Smith"
                value={this.state.lastName}
                onChange={(e) => this.setState({ lastName: e.target.value })}
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
                placeholder="Email"
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
                value={this.state.phone}
                placeholder="Phone"
                onChange={(e) => this.setState({ phone: e.target.value })}
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group
              as={Col}
              controlId="formControlsAddress"
              style={{ paddingLeft: "20px", paddingRight: "20px" }}
            >
              <Form.Label>Address</Form.Label>
              <Form.Control
                type={"text"}
                value={this.state.address}
                placeholder="Address"
                onChange={(e) => this.setState({ address: e.target.value })}
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
                value={this.state.zipcode}
                placeholder="Zip"
                onChange={(e) => this.setState({ zipcode: e.target.value })}
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
        </Form>
      </Container>
    );
  }
}

export default SignupView;
