import React, { Component } from "react";
import { Col, Form, Button, Container } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { toast } from 'react-toastify';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      toHomeView: "", // used for redirection on login success
    };
    this.submitForm = this.submitForm.bind(this);
  }

  async submitForm() {
    const user = {
      username: this.state.username,
      password: this.state.password,
    };

    if (this.state.username.length == 0 || this.state.password.length == 0) {
      toast.error("Please provide a username and password.");
      return;
    }

    let loginResult = await this.props.login(user);
    if (loginResult === 0) {
      // Successful login
      this.setState({
        toHomeView: true
      })
    }
  }

  render() {
    if (this.state.toHomeView === true) {
      return <Redirect to='/' />
    }

    return (
      <Container className="center">
        <Form>
          <Form.Row>
            <Form.Group
              as={Col}
              controlId="username"
              style={{ paddingTop: "70px", paddingLeft: "30px" }}
            >
              <Form.Label>Username</Form.Label>
              <Form.Control
                type={"text"}
                placeholder="Username"
                value={this.state.username}
                style={{ width: "150px" }}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group
              as={Col}
              controlId="password"
              style={{
                paddingTop: "10px",
                paddingLeft: "30px",
                paddingRight: "20px",
              }}
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={"password"}
                placeholder="Password"
                value={this.state.password}
                style={{ width: "150px" }}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </Form.Group>
          </Form.Row>
          <Button
            variant="dark"
            style={{ marginLeft: "30px" }}
            onClick={this.submitForm}
          >
            Login
          </Button>
        </Form>
      </Container>
    );
  }
}

export default LoginView;