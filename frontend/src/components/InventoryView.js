import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import FoodItemCard from './FoodItemCard';
import AddItemModal from './modals/AddItemModal';

// used to initialize itemToBeAdded
const emptyItem = {
  name: "",
  quantity: 1,
  food_id: "",
}

/**
 * InventoryView that shows the current inventory of pantry.
 * 
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */
class InventoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * Dummy food items.
       * TODO: Fetch actual inventory from the API
       */
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
      ],
      addItemModalShow: false, // determines the visibility of the Item Add modal
      itemToBeAdded: emptyItem, // stores the item to be added from the Item Add modal
    }
  }

  /**
   * Opens Add Item modal.
   * 
   */
  openAddItemModal() {
    this.setState({
      addItemModalShow: true
    })
  }

  /**
   * Closes Add Item modal.
   * 
   */
  closeAddItemModal() {
    this.setState({
      addItemModalShow: false,
      itemToBeAdded: emptyItem   // initialize the item for next modal open
    })
  }

  /**
   * Set method for itemsToBeAdded state.
   * 
   */
  setItemToBeAdded(data) {
    this.setState({
      itemTobeAdded: data
    })

    this.addItem(data);
  }

  /**
   * Add an item to the pantry.
   *  
   * @param {Object} data data of the item containing food_id, name, and quantity
   */ 
  addItem(data) {
    // Add the item in the state
    this.setState(prevState => ({
      foodItems: [...prevState.foodItems, data]
    }))
  }

  /**
   * Returns a list of <FoodItemCard> instances, 
   * based on the list of food items fetched from the API. 
   * 
   */ 
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
          <h2>Current Inventory</h2>
        </Row>
        <Row className="justify-content-end">
          <Button onClick={() => {this.openAddItemModal()}}>
            Add item
          </Button>
        </Row>
        <Row className="justify-content-center">
          {this.getFoodItemCards()}
        </Row>
        <AddItemModal
          show={this.state.addItemModalShow}
          onHide={() => this.closeAddItemModal()}
          addItem={this.addItem.bind(this)}
          itemToBeAdded={this.state.itemToBeAdded}
          setItemToBeAdded={this.setItemToBeAdded.bind(this)}
        />
      </Container>
    );
  }
}

export default InventoryView;