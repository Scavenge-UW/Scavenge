import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

// redux
import store from "../../store";
import { useSelector } from "react-redux";

// imports for components
import FoodItemCard from "../components_shared/FoodItemCard";
import SearchResultPantryCard from "../components_shared/SearchResultPantryCard";

// imports for services
// import ReservationService from "../../services/reservation.service";
import WishlistService from "../../services/wishlist.service";
import FoodService from "../../services/food.service";

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
function MyWishlistsView() {

  const allPantries = useSelector((store) => store.pantries);
  const foodInput = React.createRef();
  const { query } = useParams(); // get query from route param
  const [allFoods, setAllFoods] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false); // params for setting spinner
  const [selection, setSelection] = useState([]);


  useEffect(() => {
    if (query !== undefined) {
      this.setSelection([query]);
    }
  }, [query]);

  useEffect(() => {
    getAllFoods();
  }, []);

  const getAllFoods = async () => {
    const response = await FoodService.getFoods();
    setAllFoods(response);
  };

  const getSearchResults = async () => {
    if (selection.length > 0) {
      const foodObj = allFoods.find((food) => {
        return food.name === selection[0];
      });
      const response = await FoodService.searchFood(selection);
      setSearchResult(response);
    }
  };

  /**
   * Returns a full address of a pantry
   *
   */
  const getAddress = (pantry) => {
    console.log(pantry);
    let address = "";
    address += pantry.address + ", ";
    address += pantry.city + ", ";
    address += pantry.state + " ";
    address += pantry.zip;

    return address;
  };

  // componentDidMount() {
  //   this.fetchResponse();
  // }

  // get wishlist info for user from server
  // fetchResponse() {
  //   WishlistService.getUserWishlist(this.props.username).then((response) => {
  //     this.setState({
  //       resp: response,
  //       loaded: true,
  //     });
  //   });
  // }

  const getPantryCards = () => {
    let pantryCards = [];
    for (const pantry of searchResult) {
      // TODO: Change to props when API is implemented
      pantryCards.push(
        <SearchResultPantryCard pantry={pantry} />
        // <tr key={pantry.pantry_id}>
        //   <td>
        //     <Link to={"/pantries/" + pantry.pantry_id}>
        //       {
        //         allPantries.pantries.result.find((p) => {
        //           return p.pantry_id === pantry.pantry_id;
        //         }).name
        //       }
        //     </Link>
        //   </td>
        //   <td>{getAddress(pantry)}</td>
        // </tr>
      );
    }

    return pantryCards;
  };

  const showSearchResults = () => {
    // return a Spinner when loading is true
    if (loading) return <MySpinner />;

    if (searchResult.length > 0) {
      return (
        <Row className="justify-content-center mt-4">{getPantryCards()}</Row>
      );
    } else {
      return (
        <Row className="justify-content-center mt-4">
          <h6>No results</h6>
        </Row>
      );
    }
  };


  // myWishlistOverview() {
  //   let numWishlist = 0;
  //
  //   for (const wishlist of this.state.resp) {
  //     numWishlist += wishlist.foods.length;
  //   }
  //
  //   console.log(this.state.resp);
  //
  //   return (
  //     <>
  //       {/* page title */}
  //       <Row className="justify-content-center mt-4">
  //         <h2>My Wishlist</h2>
  //       </Row>
  //       <hr />
  //       {/* overview message */}
  //       <Row className="justify-content-center mt-4">
  //         <h6>You have {numWishlist} items in your wishlist.</h6>
  //       </Row>
  //     </>
  //   );
  // }

  // myWishlistItems() {
  //   let wishlists = [];
  //   for (const wishlist of this.state.resp) {
  //     let pantryId = wishlist.pantry_id;
  //     let pantryName = wishlist.name;
  //     for (const food of wishlist.foods) {
  //       let wishlistItem = (
  //         <Row className="ml-5 mr-5 align-items-center">
  //           <Col>
  //             <SearchResultPantryCard
  //               wishlistMode
  //               foodItem={food} // contains food_id, food_name, wishlist_id
  //               pantry_id={pantryId}
  //               pantry_name={pantryName}
  //               username={this.props.username}
  //               fetchResponse={() => this.fetchResponse()} // used to re-render changes user made (e.g. remove)
  //             />
  //           </Col>
  //         </Row>
  //       );
  //
  //       wishlists.push(wishlistItem);
  //     }
  //   }
  //
  //   return wishlists.length > 0 ? (
  //     wishlists
  //   ) : (
  //     <Row className="ml-5 mr-5 justify-content-center align-items-center">
  //       <h4>Your cart is empty.</h4>
  //     </Row>
  //   );
  // }

  /**
   * Renders components.
   *
   */
  return(
    // if (!this.props.username) {
    //   return <Redirect push to="/login" />;
    // }
    // if (this.state.loaded) {
    //   return (
        <Container id="my-wishlist">
          {showSearchResults()}
        </Container>
    //   );
    // } else {
    //   return (
    //     <Container id="my-wishlist-loading">
    //       <MySpinner />
    //     </Container>
    //   );
    // }
  );
}

export default MyWishlistsView;
