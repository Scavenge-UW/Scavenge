import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams } from "react-router-dom";

import FoodItemCard from '../components/FoodItemCard';

/**
 * FoodSearchView where users can search for a specific food item
 * 
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */

function FoodSearchView() {
  const foodInput = React.createRef();
  const { query } = useParams(); // get query from route param
  const [ searchResult, setSearchResult ] = useState([]);
  const dummySearchResult = [
    {
        "id": 1,
        "food_name": "Apple",
        "qr_code": null,
        "NUTRITION_COLUMNS_PLACEHOLDER": null,
    },
    {
        "id": 3,
        "food_name": "Avocado",
        "qr_code": 123123123,
        "NUTRITION_COLUMNS_PLACEHOLDER": null
    },
  ]
  
  useEffect(() => {
    if (query !== undefined) {
      foodInput.current.value = query
      onClickSearchButton();
    }
  }, [query])

  const getSearchResults = async () => {
    // TODO: Fetch search result from API
    setSearchResult(dummySearchResult);
  }

  /**
   * Returns a list of <FoodItemCard> instances, 
   * based on the list of food items fetched from the API. 
   * 
   */ 
   const getFoodItemCards = () => {
    let foodItemCards = [];
    for (const foodItem of searchResult) { // TODO: Change to props when API is implemented
      foodItemCards.push(
        <FoodItemCard
          key={foodItem.food_id}
          foodItem={foodItem}
        />
      )
    } 

    return foodItemCards;
   }

  const onClickSearchButton = async () => {
    await getSearchResults();
  }


  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <h1>Search for foods</h1>
      </Row>
      <Row className="justify-content-center mt-4">
        <Form inline>
          <Form.Label htmlFor="foodInput" srOnly>
            Food Name
          </Form.Label>
          <Form.Control
            className="mb-2 mr-sm-2"
            id="foodInput"
            placeholder="Apple"
            ref={foodInput}
          />
          <Button
            className="mb-2"
            onClick={onClickSearchButton}
          >
            Search
          </Button>
        </Form>
      </Row>
      <Row className="justify-content-center mt-4">
        {getFoodItemCards()}
      </Row>
    </Container>
  );
}



export default FoodSearchView;