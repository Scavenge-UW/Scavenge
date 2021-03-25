import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Welcome to the Welcome Page!",
      navbar4Admin: ["Manage Pantry", "Profile", "Logout"],
      navbar4Customer: ["Cart", "Reservations", "Profile", "Logout"],
      navbar4NotLoggedIn: ["Login", "Signup"],
    };
  }

  /*
   * returns:
   *   the href (route) of the given content.
   */
  getRoute(content) {
    switch (content) {
      case "Logout":
        return "/logout";
      case "Login":
        return "/login";
      case "Signup":
        return "/signup";
      case "Manage Pantry":
        return "/pantry/"
      default:
        return "/";
    }
  }

  /*
   * returns:
   *   multiple bootstrap component by mapping
   *   each content to the corresponding href (route).
   */
  renderRoute(navbarContent) {
    // console.log(navbarContent);
    return navbarContent.map((content) =>
      content === "Logout" ? (
        <LinkContainer
          key={content}
          to={this.getRoute(content)}
          onClick={()=> alert("TODO: Implement logout")}
        >
          <Nav.Link>{content}</Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer key={content} to={this.getRoute(content)}>
          <Nav.Link>{content}</Nav.Link>
        </LinkContainer>
      )
    );
  }

  render() {
    let navbarContent;
    navbarContent = this.state.navbar4NotLoggedIn;
    const { profile } = this.props;
    if (profile) {
      navbarContent = this.state.navbar4Admin;
    } else {
      navbarContent = this.state.navbar4NotLoggedIn;
    }

    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Scavenge</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {/* <LinkContainer to="/menu">
                <Nav.Link>Menu</Nav.Link>
              </LinkContainer> */}
            </Nav>
            <Nav>{this.renderRoute(navbarContent)}</Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Navigation;