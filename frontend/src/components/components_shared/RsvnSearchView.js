import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Typeahead } from "react-bootstrap-typeahead";

// imports for fontawesome
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// redux
import store from "../../store";
import { useSelector } from "react-redux";

// imports for components
import SearchResultPantryCard from "./SearchResultPantryCard";
import FoodService from "../../services/food.service";
import MySpinner from "../helper_functions/MySpinner";

// imports for css
import "../../css/FoodSearch.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

/**
 * FoodSearchView where users can search for a specific food item
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */

function FoodSearchView() {
  const [result, setResult] = useState(null);

  /**
   * Returns a list of <FoodItemCard> instances,
   * based on the list of food items fetched from the API.
   *
   */
  // const myFilter = () => {
  //   let searchResult = [];
  //   for (const rsvn of props.rsvns) {
  //     // TODO: Change to props when API is implemented
  //     pantryCards.push(
  //       <SearchResultPantryCard pantry={pantry} />
  //       // <tr key={pantry.pantry_id}>
  //       //   <td>
  //       //     <Link to={"/pantries/" + pantry.pantry_id}>
  //       //       {
  //       //         allPantries.pantries.result.find((p) => {
  //       //           return p.pantry_id === pantry.pantry_id;
  //       //         }).name
  //       //       }
  //       //     </Link>
  //       //   </td>
  //       //   <td>{getAddress(pantry)}</td>
  //       // </tr>
  //     );
  //   }

  //   return pantryCards;
  // };

  // const showSearchResults = () => {
  //   // return a Spinner when loading is true
  //   if (loading) return <MySpinner />;

  //   if (searchResult.length > 0) {
  //     return (
  //       <Row className="justify-content-center mt-4">{getPantryCards()}</Row>
  //     );
  //   } else {
  //     return (
  //       <Row className="justify-content-center mt-4">
  //         <h6>No results</h6>
  //       </Row>
  //     );
  //   }
  // };

  // const onClickSearchButton = async (e) => {
  //   e.preventDefault();
  //   // set loading to true before calling API
  //   setLoading(true);
  //   await getSearchResults();
  //   // switch loading to false after fetch is complete
  //   setLoading(false);
  // };

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <h1>Search for foods</h1>
      </Row>
      <Row className="justify-content-center mt-4">
        {/* <Form className="d-flex" obSubmit={onClickSearchButton}> */}
        <Form className="d-flex">
          <Form.Label htmlFor="foodInput" srOnly>
            Food Name
          </Form.Label>
          <Typeahead
            placeholder="searched by food or reservation id "
            className="search"
            labelKey="food"
            // options={allFoods.map((food) => food.name)}
            // onChange={setSelection}
            id="foodInput"
            multiple
          />
          <Button
            className="mb-2 search-icon"
            // onClick={onClickSearchButton}
            type="submit"
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Form>
      </Row>
      <Row className="justify-content-center mr-5">
        <small>
          <em>Tab to autocomplete food</em>
        </small>
      </Row>
      {/* {showSearchResults()} */}
    </Container>
  );
}

export default FoodSearchView;
