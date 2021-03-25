import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import FoodItemCard from "./FoodItemCard";
import AddItemModal from "./modals/AddItemModal";

// used to initialize itemToBeAdded
const emptyItem = {
  name: "",
  quantity: 1,
  food_id: "",
};

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
          name: "Andy's Banana",
          quantity: 69,
        },
        {
          food_id: 4,
          name: "Janice's McNuggets",
          quantity: 69,
        },
        {
          food_id: 5,
          name: "Edit Me!",
          quantity: 5,
        },
      ],
      addItemModalShow: false, // determines the visibility of the Item Add modal
      itemToBeAdded: emptyItem, // stores the item to be added from the Item Add modal
    };
  }

  /**
   * Opens Add Item modal.
   *
   */
  openAddItemModal() {
    this.setState({
      addItemModalShow: true,
    });
  }

  /**
   * Closes Add Item modal.
   *
   */
  closeAddItemModal() {
    this.setState({
      addItemModalShow: false,
      itemToBeAdded: emptyItem, // initialize the item for next modal open
    });
  }

  /**
   * Set method for itemsToBeAdded state.
   *
   */
  setItemToBeAdded(data) {
    this.setState({
      itemTobeAdded: data,
    });

    console.log("setItemToBeAdded(data) = ", data); // debug-remove

    this.addItem(data);
  }

  /**
   * Add an item to the foodItems state.
   *
   * @param {Object} data data of the item containing food_id, name, and quantity
   */
  addItem(data) {
    // Add the item in the state
    this.setState((prevState) => ({
      foodItems: [...prevState.foodItems, data],
    }));
    console.log("addItem(data) = ", data); // debug-remove
  }

  /**
   * Remove an item from the foodItems state.
   * Passed down to <FoodItemCard>
   *
   * @param {int} food_id
   */

  removeItem(food_id) {
    let foodItemsCopy = [...this.state.foodItems];
    foodItemsCopy = foodItemsCopy.filter((item) => {
      return item.food_id !== food_id;
    });

    // debug-remove
    console.log("removeItem(food_id) = ", food_id);
    console.log("...this.state.foodItems = ", ...this.state.foodItems);

    this.setState({
      foodItems: foodItemsCopy,
    });
  }

  /**
   * Remove item quantity from the foodItems state.
   * Passed down to <FoodItemCard>
   *
   * @param {int} food_id
   */

  updateItemQuantity(food_id, newQuantity) {
    // TODO: checks for valid input

    console.log("updateItemQuantity(): "); // debug-remove
    let foodItemsCopy = [...this.state.foodItems];
    foodItemsCopy.forEach((item, idx) => {
      console.log("item.food_id = ", item.food_id); // debug-remove
      if (item.food_id === food_id) {
        foodItemsCopy[idx].quantity = newQuantity;
      }
    });

    // debug-remove
    console.log("updateItemQuantity(food_id, newQuantity)");
    console.log({ food_id });
    console.log({ newQuantity });
    console.log("...this.state.foodItems = ", ...this.state.foodItems);

    this.setState({
      foodItems: foodItemsCopy,
    });
  }

  /**
   * Returns a list of <FoodItemCard> instances,
   * based on the list of food items fetched from the API.
   *
   */
  getFoodItemCards() {
    let foodItemCards = [];
    for (const foodItem of this.state.foodItems) {
      // TODO: Change to props when API is implemented
      foodItemCards.push(
        <FoodItemCard
          key={foodItem.food_id}
          foodItem={foodItem}
          removeItem={this.removeItem.bind(this)}
          updateItemQuantity={this.updateItemQuantity.bind(this)}
        />
      );
    }

    // Use filler card to align cards correctly.
    // This prevents a single card on the last row from being centered.
    if (foodItemCards.length % 2) {
      foodItemCards.push(<FoodItemCard type="filler" />);
    }

    return foodItemCards;
  }

  /**
   * Returns the textual description of the current inventory.
   *
   */
  getInventoryOverview() {
    let numItems = this.state.foodItems.length;
    let numOutOfStockItems = this.state.foodItems.filter((item) => {
      return item.quantity === 0;
    }).length;

    return (
      <p className="text-center mt-4">
        There are {numItems} items in total in your food pantry.
        <br />
        {numOutOfStockItems} items are currently out of stock.
      </p>
    );
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <h2>Current Inventory</h2>
        </Row>
        <hr />
        <Row className="justify-content-center">
          {this.getInventoryOverview()}
        </Row>
        <Row className="justify-content-end">
          <Button
            onClick={() => {
              this.openAddItemModal();
            }}
          >
            Add item
          </Button>
        </Row>
        <Row className="justify-content-center">{this.getFoodItemCards()}</Row>
        <AddItemModal
          show={this.state.addItemModalShow}
          onHide={() => this.closeAddItemModal()}
          addItem={this.addItem.bind(this)}
          itemToBeAdded={this.state.itemToBeAdded}
          setItemToBeAdded={this.setItemToBeAdded.bind(this)}
        />
        <Row className="justify-content-center">
          <p className="mt-4">
            Time Is Money - We provide an efficient way for you to update
            available items.
          </p>
        </Row>
      </Container>
    );
  }
}

export default InventoryView;
