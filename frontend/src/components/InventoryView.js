import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import FoodItemCard from './FoodItemCard';

class InventoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Dummy Food Items
      foodItems: [
        {
          food_id: 1,
          name: "Apple",
          quantity: 123,
        },
        {
          food_id: 2,
          name: "Banana",
          quantity: 0,
        },
        {
          food_id: 3,
          name: "Edit Me!",
          quantity: 5,
        },
      ]
    }
  }

  // Returns a list of <FoodItemCard> instances 
  // based on the list of food items fetched from the API
  getFoodItemCards(){
    let foodItemCards = [];
    for (const foodItem of this.state.foodItems) { // TODO: Change to props when API is implemented
      foodItemCards.push(
        <FoodItemCard
          key={foodItem.id}
          foodItem={foodItem}
        />
      )
    } 

    if (foodItemCards.length % 2) {
      foodItemCards.push(<FoodItemCard type="filler" />)
    }

    return foodItemCards;
  }
  
  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <h2>Current Inventory</h2>
        </Row>
        <Row className="justify-content-end">
          <Button>Add item</Button>
        </Row>
        <Row className="justify-content-center">
          {this.getFoodItemCards()}
        </Row>
      </Container>
    );
  }
}

export default InventoryView;