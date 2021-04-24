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
import PantryCard from "./PantryDetailCard";
import FoodService from "../../services/food.service";

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
  const allPantries = useSelector((store) => store.pantries);
  const foodInput = React.createRef();
  const { query } = useParams(); // get query from route param
  const [allFoods, setAllFoods] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchFound, setSearchFound] = useState(false);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    if (query !== undefined) {
      this.setSelection([query]);
      onClickSearchButton();
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
      setSearchFound(true);
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

  /**
   * Returns a list of <FoodItemCard> instances,
   * based on the list of food items fetched from the API.
   *
   */
  const getPantryCards = () => {
    let pantryCards = [];
    for (const pantry of searchResult) {
      // TODO: Change to props when API is implemented
      pantryCards.push(
        <PantryCard pantry={pantry} />
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
    if (searchResult.length > 0) {
      return getPantryCards();
    } else {
      return <h6>No results</h6>;
    }
  };

  const onClickSearchButton = async (e) => {
    e.preventDefault();
    await getSearchResults();
  };

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <h1>Search for foods</h1>
      </Row>
      <Row className="justify-content-center mt-4">
        <Form className="d-flex" obSubmit={onClickSearchButton}>
          <Form.Label htmlFor="foodInput" srOnly>
            Food Name
          </Form.Label>
          <Typeahead
            placeholder="Choose a food... "
            className="search"
            labelKey="food"
            options={allFoods.map((food) => food.name)}
            onChange={setSelection}
            id="foodInput"
            multiple
          />
          <Button
            className="mb-2 search-icon"
            onClick={onClickSearchButton}
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
      <Row className="justify-content-center mt-4">{showSearchResults()}</Row>
    </Container>
  );
}

export default FoodSearchView;
