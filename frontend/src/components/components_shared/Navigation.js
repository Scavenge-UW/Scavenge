import React, { Component } from "react";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";

// imports for icons
import { BsGift } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import {
  FiUser,
  FiEdit,
  FiLogIn,
  FiLogOut,
  FiSearch,
  FiUserPlus,
  FiClipboard,
  FiHelpCircle,
  FiShoppingCart,
} from "react-icons/fi";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Welcome to the Welcome Page!",
      navbar4Admin: [
        "Search Foods",
        "Manage Pantry",
        "Help",
        "Profile",
        "Logout",
      ],
      navbar4Customer: [
        "Search Foods",
        "Reservations",
        "Wishlist",
        "Cart",
        "Help",
        "Profile",
        "Logout",
      ],
      navbar4NotLoggedIn: ["Search Foods", "Help", "Login", "Signup"],
    };
  }

  /*
   * returns:
   *   the href (route) of the given content.
   */
  getIcons(content) {
    switch (content) {
      case "Logout":
        return (
          <>
            <FiLogOut size="1.3rem" />
          </>
        ); // will be redirected to '/' upon successful logout
      case "Login":
        return (
          <>
            <FiLogIn size="1.3rem" />
          </>
        );
      case "Signup":
        return (
          <>
            <FiUserPlus size="1.3rem" />
          </>
        );
      case "Manage Pantry":
        return (
          <>
            <FiEdit size="1.3rem" />
          </>
        );
      case "Search Foods":
        return (
          <>
            <FiSearch size="1.3rem" />
          </>
        );
      case "Cart":
        return (
          <>
            <FiShoppingCart size="1.3rem" />
          </>
        );
      case "Profile":
        return (
          <>
            <FiUser size="1.3rem" />
          </>
        );
      case "Reservations":
        return (
          <>
            <FiClipboard size="1.3rem" />
          </>
        );
      case "Wishlist":
        return (
          <>
            <BsGift size="1.3rem" />
          </>
        );
      case "Help":
        return (
          <>
            <FiHelpCircle size="1.3rem" />
          </>
        );
      default:
        return "/";
    }
  }

  /*
   * returns:
   *   the href (route) of the given content.
   */
  getRoute(content) {
    switch (content) {
      case "Logout":
        return "/logout"; // will be redirected to '/' upon successful logout
      case "Login":
        return "/login";
      case "Signup":
        return "/signup";
      case "Manage Pantry":
        return "/pantry";
      case "Search Foods":
        return "/search-food";
      case "Cart":
        return "/cart";
      case "Profile":
        return "/profile";
      case "Reservations":
        return "/reservations";
      case "Wishlist":
        return "/wishlist";
      case "Help":
        return "/help";
      default:
        return "/";
    }
  }

  /*
   * returns:
   *   multiple bootstrap component by mapping
   *   each content to the corresponding href (route)
   *   and corresponding icon.
   */
  renderRoute(navbarContent) {
    // console.log(navbarContent);
    return navbarContent.map((content) =>
      content === "Logout" ? (
        <LinkContainer
          key={content}
          to={this.getRoute(content)}
          onClick={() => this.props.logout()}
        >
          <Nav.Link>
            {this.getIcons(content)}
            {"  " + content}
          </Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer key={content} to={this.getRoute(content)}>
          <Nav.Link>
            {this.getIcons(content)}
            {"  " + content}
          </Nav.Link>
        </LinkContainer>
      )
    );
  }

  render() {
    let navbarContent;
    navbarContent = this.state.navbar4NotLoggedIn;
    const { profile } = this.props;
    if (this.props.isAdmin()) {
      navbarContent = this.state.navbar4Admin;
    } else {
      if (profile) {
        navbarContent = this.state.navbar4Customer;
      } else {
        navbarContent = this.state.navbar4NotLoggedIn;
      }
    }

    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <h3>
                <IoHomeOutline /> Scavenge
              </h3>
            </Navbar.Brand>
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
