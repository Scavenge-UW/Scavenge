import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

import { useParams, Link } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

import store from "../store";

import FoodService from "../services/food.service";
import FoodItemCard from "../components/FoodItemCard";
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
  const [selection, setSelection] = useState([]);
  const dummySearchResult = [
    {
      id: 1,
      food_name: "Apple",
      qr_code: null,
      NUTRITION_COLUMNS_PLACEHOLDER: null,
    },
    {
      id: 3,
      food_name: "Avocado",
      qr_code: 123123123,
      NUTRITION_COLUMNS_PLACEHOLDER: null,
    },
  ];

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
      const response = await FoodService.searchFood(foodObj.id);
      setSearchResult(response);
    }

    // setSearchResult(dummySearchResult);
  };

  /**
   * Returns a list of <FoodItemCard> instances,
   * based on the list of food items fetched from the API.
   *
   */
  const getPantryCards = () => {
    let pantries = [];
    for (const pantry of searchResult) {
      // TODO: Change to props when API is implemented
      pantries.push(
        <tr key={pantry.pantry_id}>
          <td>
            <Link to={"/pantries/" + pantry.pantry_id}>
              {
                allPantries.pantries.result.find((p) => {
                  return p.pantry_id === pantry.pantry_id;
                }).name
              }
            </Link>
          </td>
          <td>{pantry.quantity}</td>
        </tr>
      );
    }

    return pantries;
  };

  const showSearchResults = () => {
    if (searchResult.length > 0) {
      return (
        <Table striped bordered hover className="bg-light">
          <thead>
            <tr>
              <th>Pantry</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>{getPantryCards()}</tbody>
        </Table>
      );
    } else {
      return <h6>No results</h6>;
    }
  };

  const onClickSearchButton = async () => {
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
            placeholder="Choose a food..."
            className="mr-2"
            labelKey="food"
            options={allFoods.map((food) => food.name)}
            onChange={setSelection}
            id="foodInput"
          />
          <Button className="mb-2" onClick={onClickSearchButton}>
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Form>
      </Row>
      <Row className="justify-content-center mr-5">
        <p>Tab to autocomplete food</p>
      </Row>
      <Row className="justify-content-center mt-4">{showSearchResults()}</Row>
    </Container>
  );
}

export default FoodSearchView;
