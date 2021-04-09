import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import FoodItemCard from './WishListItemCard';


// used to initialize itemToBeAdded
const emptyItem = {
  name: "",
  quantity: 1,
  food_id: "",
}

class WishListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * Dummy food items.
       * TODO: Fetch actual inventory from the API
       */
      foods: [
        // {
        //   food_id: 1,
        //   name: "Apple",
        //   quantity: 123,
        // },
        // {
        //   food_id: 2,
        //   name: "Banana",
        //   quantity: 0,
        // },
        // {
        //   food_id: 3,
        //   name: "Edit Me!",
        //   quantity: 5,
        // },
      ],
    }
  }

  componentDidMount() {
    if () {
      this.setState({
        foods: Object.values()
      })
    }
  }


  /**
   * Returns a list of <WishListItemCard> instances,
   * based on the list of food items fetched from the API.
   *
   */
  getFoodItemCards(){
    let foodItemCards = [];
    for (const foodItem of this.state.foods) { // TODO: Change to props when API is implemented
      foodItemCards.push(
        <WishListItemCard
          key={foodItem.food_id}
          foodItem={foodItem}
          removeItem={this.removeItem.bind(this)}
          updateItemQuantity={this.updateItemQuantity.bind(this)}
        />
      )
    }

    // Use filler card to align cards correctly.
    // This prevents a single card on the last row from being centered.
    if (foodItemCards.length % 2) {
      foodItemCards.push(<FoodItemCard type="filler" />)
    }

    return foodItemCards;
  }



  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <h2>Wish List</h2>
        </Row>
        <Row className="justify-content-center">

        </Row>
        <Row className="justify-content-center">
          {this.getFoodItemCards()}
        </Row>
      </Container>
    );
  }
}

export default WishListView;
