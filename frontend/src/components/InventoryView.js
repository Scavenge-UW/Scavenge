import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

import FoodItemCard from "./FoodItemCard";
import AddItemModal from "./modals/AddItemModal";
import PantryService from "../services/pantry.service";
import MySpinner from "./helper_functions/MySpinner";

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
       */
      foods: [],
      pantryName: "",
      addItemModalShow: false, // determines the visibility of the Item Add modal
      itemToBeAdded: emptyItem, // stores the item to be added from the Item Add modal
    };
  }

  componentDidMount() {
    if (this.props.pantryDetail) {
      console.log(this.props.pantryDetail);
      this.setState({
        foods: this.props.pantryDetail.foods,
        pantryName: this.props.pantryDetail.name,
      });
    }
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
      itemToBeAdded: data,
    });

    this.addItem(data);
  }

  /**
   * Add an item to the foodItems state.
   *
   * @param {Object} data data of the item containing food_id, name, and quantity
   */
  addItem(data) {
    PantryService.addFoodItemToInventory(
      1, // TODO: Change to actual pantry id
      data
    )
      .then(() => {
        toast.success(data.food_name + " was successfully added!");
        // Add the item in the state
        this.setState((prevState) => ({
          foods: [...prevState.foods, data],
        }));
      })
      .catch(() => {
        toast.error("Error while adding " + data.food_name + " to inventory.");
      });
  }

  /**
   * Remove an item from the foodItems state.
   * Passed down to <FoodItemCard>
   *
   * @param {int} food_id
   */

  removeItem(food_id) {
    let foodsCopy = [...this.state.foods];
    foodsCopy = foodsCopy.filter((item) => {
      return item.food_id != food_id;
    });

    this.setState({
      foods: foodsCopy,
    });
  }

  /**
   * Remove item quantity from the foodItems state.
   * Passed down to <FoodItemCard>
   *
   * @param {int} food_id
   */

  updateItemQuantity(food_id, newQuantity) {
    let foodsCopy = [...this.state.foods];
    foodsCopy.forEach((item, idx) => {
      if (item.food_id === food_id) {
        foodsCopy[idx].quantity = newQuantity;
      }
    });

    this.setState({
      foods: foodsCopy,
    });
  }

  /**
   * Returns a list of <FoodItemCard> instances,
   * based on the list of food items fetched from the API.
   *
   */
  getFoodItemCards() {
    let foodItemCards = [];
    for (const foodItem of this.state.foods) {
      // TODO: Change to props when API is implemented
      foodItemCards.push(
        <FoodItemCard
          adminMode
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
    let numItems = this.state.foods.length;
    let numOutOfStockItems = this.state.foods.filter((item) => {
      return item.quantity == 0;
    }).length;

    return (
      <>
        <Row className="justify-content-center">
          <h2>{this.state.pantryName}</h2>
        </Row>
        <Row className="justify-content-center">
          <h3>Current Inventory</h3>
        </Row>
        <hr />
        <Row id="inventory-overview-1" className="justify-content-center mt-2">
          <h6>There are {numItems} items in total in your food pantry.</h6>
        </Row>
        <Row id="inventory-overview-2" className="justify-content-center">
          <h6>{numOutOfStockItems} items are currently out of stock.</h6>
        </Row>
      </>
    );
  }

  render() {
    if (this.state.pantryName) {
      return (
        <Container>
          {this.getInventoryOverview()}
          <Row className="justify-content-end">
            <Button
              id="btn-add-item"
              onClick={() => {
                this.openAddItemModal();
              }}
            >
              Add item
            </Button>
          </Row>
          <Row className="justify-content-center">
            {this.getFoodItemCards()}
          </Row>
          <AddItemModal
            show={this.state.addItemModalShow}
            onHide={() => this.closeAddItemModal()}
            setItemToBeAdded={this.setItemToBeAdded.bind(this)}
          />
          <Row className="justify-content-center">
            <p className="mt-4">
              Time is Money. We provide an efficient way for you to update
              available items.
            </p>
          </Row>
        </Container>
      );
    }
    return (
      <Container id="inventory-view-loading">
        <MySpinner />
      </Container>
    );
  }
}

export default InventoryView;
