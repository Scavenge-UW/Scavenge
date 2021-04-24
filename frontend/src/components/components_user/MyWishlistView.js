import React, { Component } from "react";
import { Redirect } from "react-router-dom";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

// imports for components
import FoodItemCard from "../components_shared/FoodItemCard";

// imports for services
// import ReservationService from "../../services/reservation.service";
import WishlistService from "../../services/wishlist.service";

// imports for helper functions
import MySpinner from "../helper_functions/MySpinner";

/**
 * MyReservationsView
 * A view where civilian users can see reservations they made
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 *
 */
class MyWishlistsView extends Component {
  constructor(props) {
    super(props);
    this.state = { resp: [], loaded: false };
  }

  componentDidMount() {
    this.fetchResponse();
  }

  fetchResponse() {
    const response = WishlistService.getUserWishlist(this.props.username).then(
      (response) => {
        this.setState({
          resp: response,
          loaded: true,
        });
      }
    );
  }

  // /**
  //  *  Mark a reservation as cancelled
  //  *
  //  * @param {*} rsvn_id
  //  */
  // markWithDraw(pantry_id, rsvn_id) {
  //   console.log(rsvn_id);
  //   PantryService.setCancelled(pantry_id, rsvn_id)
  //     .then(() => {
  //       this.fetchResponse(); // push changes to be displayed by re-rendered
  //       toast.success(
  //         "You have successfully withdrawed your reservation with ID " + rsvn_id
  //       );
  //     })
  //     .catch(() => {
  //       toast.error(
  //         "Error while withdrawing your reservation with ID " + rsvn_id
  //       );
  //     });
  // }

  myWishlistOverview() {
    let numWishlist = 0;

    for (const wishlist of this.state.resp) {
      numWishlist += wishlist.foods.length;
    }

    console.log(this.state.resp);

    return (
      <>
        {/* page title */}
        <Row className="justify-content-center mt-4">
          <h2>My Wishlist</h2>
        </Row>
        <hr />
        {/* overview message */}
        <Row className="justify-content-center mt-4">
          <h6>You have {numWishlist} items in your wishlist.</h6>
        </Row>
      </>
    );
  }

  myWishlistItems() {
    let wishlists = [];
    for (const wishlist of this.state.resp) {
      let pantryId = wishlist.pantry_id;
      // let pantryName = wishlist.name;
      for (const food of wishlist.foods) {
        let wishlistItem = (
          <Row className="ml-5 mr-5 align-items-center">
            <Col>
              <FoodItemCard
                wishlistMode
                foodItem={food} // contains food_id, food_name, wishlist_id
                pantry_id={pantryId}
                // pantry_name={}
                username={this.props.username}
                fetchResponse={() => this.fetchResponse()}
              />
            </Col>
          </Row>
        );

        wishlists.push(wishlistItem);
      }
    }

    return wishlists.length > 0 ? (
      wishlists
    ) : (
      <Row className="ml-5 mr-5 justify-content-center align-items-center">
        <h4>Your cart is empty.</h4>
      </Row>
    );
  }

  /**
   * Renders components.
   *
   */
  render() {
    if (!this.props.username) {
      return <Redirect push to="/login" />;
    }
    if (this.state.loaded) {
      return (
        <Container id="my-wishlist">
          {this.myWishlistOverview()} {this.myWishlistItems()}
        </Container>
      );
    } else {
      return (
        <Container id="my-wishlist-loading">
          <MySpinner />
        </Container>
      );
    }
  }
}

export default MyWishlistsView;
