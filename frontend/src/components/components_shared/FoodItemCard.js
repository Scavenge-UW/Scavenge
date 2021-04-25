import React, { Component } from "react";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

// other imports
import "../../css/common.css";
import { toast } from "react-toastify";
import { VscCircleFilled } from "react-icons/vsc";

// imports for actions and helper function
import store from "../../store";
import PantryService from "../../services/pantry.service";
import WishlistService from "../../services/wishlist.service";
import OneClickReserveModal from "../modals/OneClickReserveModal";
import {
  addToCart,
  deleteFromCart,
  updateQuantity,
} from "../../actions/cart.actions";

class FoodItemCard extends Component {
  constructor(props) {
    super(props);

    this.newQuantity = React.createRef(); // for admin inventory management
    this.cartQuantity = React.createRef(); // for civilian user reserving foods

    this.state = {
      editMode: false,
      showOneClickReserveModal: false,
      cartQuantity: 0,
      decrementBtnDisabled: false,
    };
  }

  /**
   * Return if the item is in stock.
   *
   * @returns {boolean} true if the item is in stock, false if out of stock
   */
  isInStock() {
    return this.props.foodItem.quantity > 0;
  }

  /**
   * Display current stock information.
   *
   * @returns an HTML object that consists of stock info along with visual icon
   */
  showStockInfo() {
    if (this.isInStock()) {
      return (
        <>
          <span id="current-stock">In Stock</span>
          <VscCircleFilled color="green" />
        </>
      );
    } else {
      return (
        <>
          <span id="current-stock">Out of Stock</span>
          <VscCircleFilled color="red" />
        </>
      );
    }
  }

  setShowOneClickReserveModal(show) {
    this.setState({
      showOneClickReserveModal: show,
    });
  }

  /**
   * TODO: This function is fired when One Click Reserve button is clicked
   *
   */
  onClickOneClickReserve() {
    if (!this.props.isLoggedIn()) {
      toast.info("Please log in to reserve items.");
    } else if (this.props.isAdmin()) {
      toast.error(
        "You are currently logged in as Admin. Only Civilian Users can reserve items."
      );
    } else {
      this.setShowOneClickReserveModal(true);
      this.setState({
        cartQuantity: this.cartQuantity.current.value,
      });
    }
  }

  /**
   * TODO: This function is fired when Add to Cart button is clicked
   *
   */
  onClickAddToCart() {
    if (!this.props.isLoggedIn()) {
      toast.info("Please log in to add items to cart.");
    } else if (this.props.isAdmin()) {
      toast.error(
        "You are currently logged in as Admin. Only Civilian Users can add items to cart."
      );
    } else {
      let itemName = this.props.foodItem.food_name;

      store.dispatch(
        addToCart({
          item: this.props.foodItem,
          cartQuantity: this.cartQuantity.current.value,
          pantry: this.props.pantry,
        })
      );
      toast.info("🛒 " + itemName + " was added to your cart!");
    }
  }

  /**
   * Add item to wishlsit and prompt messages for invalid user type
   */
  onClickAddToWishlist() {
    if (!this.props.isLoggedIn()) {
      toast.info("Please log in to add items to wishlist.");
    } else if (this.props.isAdmin()) {
      toast.error(
        "You are currently logged in as Admin. Only Civilian Users can add items to wishlist."
      );
    } else {
      let itemName = this.props.foodItem.food_name;

      WishlistService.addToWishlist(this.props.username, {
        food_id: this.props.foodItem.food_id,
        pantry_id: this.props.pantry.pantry_id,
      });
      toast.info("🎁 " + itemName + " was added to your wishlist!");
    }
  }

  onClickDeleteWishlistItem() {
    let username = this.props.username;
    let wishlist_id = this.props.foodItem.wishlist_id;
    let food_name = this.props.foodItem.food_name;
    if (
      window.confirm(
        "Are you sure you want to remove " + food_name + " from your wishlist?"
      )
    ) {
      WishlistService.removeFromWishlist(username, wishlist_id)
        .then(() => {
          this.props.fetchResponse();
          toast.success("🗑️ Removed " + food_name + " from your wishlist.");
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  /**
   * Ask for delete confirmation and remove the item.
   *
   */
  onClickRemoveItem() {
    let itemName = this.props.foodItem.food_name;
    let food_id = this.props.foodItem.food_id;

    if (window.confirm("Are you sure you want to delete " + itemName + "?")) {
      // TODO: send delete request to the server

      this.props.removeItem(food_id);
    }
  }

  /**
   * Ask for confirmation and update the item's quantity in the inventory (ADMIN)
   *
   */
  onClickUpdateItemQuantity() {
    let itemName = this.props.foodItem.food_name;
    let food_id = this.props.foodItem.food_id;

    if (window.confirm("Are you sure you want to update " + itemName + "?")) {
      PantryService.updateFoodItem(1, food_id, {
        quantity: this.newQuantity.current.value,
      })
        .then(() => {
          toast.success(itemName + "'s quantity was successfully updated!");
          this.props.updateItemQuantity(
            food_id,
            this.newQuantity.current.value
          );
          this.deactivateEditMode();
        })
        .catch((response) => {
          if (response.message) {
            toast.error(response.message);
          }
        });
    }
  }

  /**
   * update quantity of item in cart
   *
   */
  onUpdateCartItemQuantity() {
    let itemName = this.props.foodItem.food_name;

    store.dispatch(
      updateQuantity(
        this.props.foodItem.food_id,
        this.cartQuantity.current.value
      )
    );
    this.setState({
      cartQuantity: this.cartQuantity.current.value,
    });
  }

  /**
   * delete item in cart
   *
   */
  onClickDeleteCartItem() {
    let itemName = this.props.foodItem.food_name;

    store.dispatch(deleteFromCart(this.props.foodItem.food_id));
    toast.warn("🗑️ Removed " + itemName + ".");
  }

  /**
   *
   * @param {int} newQuantity newQuantity
   */
  onChangeItemQuantity(newQuantity) {
    this.setState({
      newQuantity: newQuantity,
    });
  }

  activateEditMode() {
    this.setState({
      editMode: true,
    });
  }

  deactivateEditMode() {
    this.newQuantity.current.value = this.props.foodItem.quantity;
    this.setState({
      editMode: false,
    });
  }

  showUpdateItemQuantityButton() {
    if (this.state.editMode) {
      return (
        <Row>
          <Col>
            <Button block onClick={this.onClickUpdateItemQuantity.bind(this)}>
              Update
            </Button>
          </Col>
          <Col>
            <Button
              id="btn-cancel-edit-quantity"
              block
              variant="danger"
              onClick={this.deactivateEditMode.bind(this)}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      );
    } else {
      return (
        <Button
          id="btn-edit-quantity"
          block
          variant="outline-primary"
          onClick={this.activateEditMode.bind(this)}
        >
          Edit quantity
        </Button>
      );
    }
  }

  /**
   * Return controls that only admins can access (edit and remove)
   *
   */
  showAdminControls() {
    if (this.props.adminMode) {
      return (
        <>
          <hr />
          <Row>
            <Col>
              <Form>
                <Form.Group controlId="formQuantity">
                  {/* TODO: validate valid input quantity number */}
                  <Form.Label>Enter quantity in stock</Form.Label>
                  <Form.Control
                    type="number"
                    disabled={!this.state.editMode}
                    placeholder="Quantity"
                    defaultValue={this.props.foodItem.quantity}
                    ref={this.newQuantity}
                    min="0" // test
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col>
              {/* Empty label is for aligning the input and the button */}
              <Form.Label>&nbsp;</Form.Label>
              {this.showUpdateItemQuantityButton()}
            </Col>
          </Row>
          <Row>
            <Button
              id="btn-remove-item"
              className="ml-3 mr-3"
              block
              variant="outline-danger"
              onClick={this.onClickRemoveItem.bind(this)}
            >
              Remove
            </Button>
          </Row>
        </>
      );
    }
  }

  /**
   * Return controls that users can use to reserve items
   *
   */
  showReserveControls() {
    if (
      !this.props.cartMode &&
      !this.props.adminMode &&
      !this.props.wishlistMode
    ) {
      return (
        <Row className="mt-4 justify-content-end align-items-end">
          <Col>
            <Row>
              <Form.Label column="sm">Quantity to Reserve</Form.Label>
            </Row>
            <Row>
              <Col className="col-8">
                <InputGroup>
                  {/* Increment Button */}
                  <InputGroup.Prepend>
                    <Button
                      className="increment-cart-item"
                      variant="outline-primary"
                      onClick={() => {
                        // increment cartQuantity by 1
                        this.cartQuantity.current.value =
                          parseInt(this.cartQuantity.current.value) + 1;
                        // set decrement button to enabled if quantity > 0
                        if (parseInt(this.cartQuantity.current.value) > 0)
                          this.setState({ decrementBtnDisabled: false });
                        this.onUpdateCartItemQuantity();
                      }}
                      disabled={!this.isInStock()}
                    >
                      +
                    </Button>
                  </InputGroup.Prepend>

                  {/* Display quantity form */}
                  <FormControl
                    type="number"
                    onChange={() => {
                      this.onUpdateCartItemQuantity();
                      if (parseInt(this.cartQuantity.current.value) < 1)
                        this.setState({ decrementBtnDisabled: true });
                      else this.setState({ decrementBtnDisabled: false });
                      console.log(this.state.decrementBtnDisabled);
                    }}
                    disabled={!this.isInStock()}
                    defaultValue={1}
                    ref={this.cartQuantity}
                    min="0" // VALIDATE: set min to 0
                  />

                  {/* Decrement Button */}
                  <InputGroup.Append>
                    <Button
                      className="decrement-cart-item"
                      variant="outline-primary"
                      onClick={() => {
                        // decrement cartQuantity by 1
                        this.cartQuantity.current.value =
                          parseInt(this.cartQuantity.current.value) - 1;
                        // VALIDATE: set decrement button to disabled if quantity <= 1
                        if (parseInt(this.cartQuantity.current.value) < 1)
                          this.setState({ decrementBtnDisabled: true });
                        // update quantity displayed
                        this.onUpdateCartItemQuantity();
                      }}
                      disabled={
                        !this.isInStock() || this.state.decrementBtnDisabled
                      }
                    >
                      -
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Row>
          </Col>
          <Col className="col-6 text-right">
            {/* display One Click Reserve buttons if item is in stock */}
            {this.isInStock() && (
              <Row className="justify-content-end mb-1">
                <Button
                  id="btn-one-click-reserve"
                  block
                  variant="success"
                  onClick={this.onClickOneClickReserve.bind(this)}
                >
                  One Click Reserve
                </Button>
              </Row>
            )}
            {/* display Add to Cart buttons if item is in stock */}
            {this.isInStock() && (
              <Row className="justify-content-end mb-1">
                <Button
                  id="btn-add-to-cart"
                  block
                  variant="info"
                  onClick={this.onClickAddToCart.bind(this)}
                >
                  Add to Cart
                </Button>
              </Row>
            )}
            {/* display Add to Wishlist buttons if item is out of stock */}
            {!this.isInStock() && (
              <Row className="justify-content-end">
                <Button
                  id="btn-add-to-wishlist"
                  block
                  variant="dark"
                  onClick={this.onClickAddToWishlist.bind(this)}
                >
                  Add to Wishlist
                </Button>
              </Row>
            )}
          </Col>
        </Row>
      );
    }
  }

  /**
   * Returns controls used in cart mode, such as quantity update and item deletion
   *
   * @returns Controls used in cart mode
   */
  showCartControls() {
    if (this.props.cartMode) {
      return (
        <Row className="mt-4 justify-content-between">
          <Col xs={8} md={6} lg={4}>
            <Row>
              <Form.Label column="sm">Quantity</Form.Label>
            </Row>
            <Row>
              <Col>
                <InputGroup size="sm">
                  <InputGroup.Prepend>
                    <Button
                      className="increment-cart-item"
                      variant="outline-primary"
                      onClick={() => {
                        this.cartQuantity.current.value =
                          parseInt(this.cartQuantity.current.value) + 1; // increment cartQuantity by 1
                        this.onUpdateCartItemQuantity();
                      }}
                      disabled={!this.isInStock()}
                    >
                      +
                    </Button>
                  </InputGroup.Prepend>
                  {/* TODO: validate valid input quantity number */}
                  <FormControl
                    onChange={this.onUpdateCartItemQuantity.bind(this)}
                    type="number"
                    defaultValue={this.props.cartQuantity}
                    ref={this.cartQuantity}
                    min="1" // test
                  />
                  <InputGroup.Append>
                    <Button
                      className="decrement-cart-item"
                      variant="outline-primary"
                      onClick={() => {
                        this.cartQuantity.current.value =
                          parseInt(this.cartQuantity.current.value) - 1; // decrement cartQuantity by 1
                        this.onUpdateCartItemQuantity();
                      }}
                      disabled={!this.isInStock()}
                    >
                      -
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
              <Col>
                {/* <Button
                  onClick={this.onClickUpdateCartItemQuantity.bind(this)}
                  size="sm"
                  block
                >
                  Update
                </Button> */}
              </Col>
            </Row>
          </Col>
          <Col xs={4} md={3} lg={2}>
            <Row className="mb-2">
              <Col>&nbsp;</Col>
            </Row>
            <Row>
              <Col>
                <Button
                  onClick={this.onClickDeleteCartItem.bind(this)}
                  size="sm"
                  block
                  variant="danger"
                >
                  Remove
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }
  }

  /**
   * Returns controls used in wishlist mode.
   *
   * @returns Controls used in wishlist mode
   */
  showWishlistControls() {
    // wishlistMode
    // food={food} // contains food_id, food_name, wishlist_id
    // pantry_id={pantryId}
    // username={this.props.username}
    if (this.props.wishlistMode) {
      return (
        <Row className="mt-4 justify-content-center" md={6}>
          {/* <Col className="text-center" md={3}> */}
          <Button
            size="sm"
            block
            variant="danger"
            onClick={(username, wishlist_id) =>
              this.onClickDeleteWishlistItem()
            }
          >
            Remove from Wishlist
          </Button>
          {/* </Col> */}
        </Row>
      );
    }
  }

  showPantryName() {
    if (this.props.cartMode) {
      return (
        <Row className="justify-content-center text-center mt-4">
          <Col>
            <span style={{ fontSize: "1rem" }}>
              from {this.props.pantry.name}
            </span>
          </Col>
        </Row>
      );
    }
    if (this.props.wishlistMode) {
      return (
        <Row className="justify-content-center text-center mt-4">
          <Col>
            <span style={{ fontSize: "1rem" }}>
              from {this.props.pantry_name}
            </span>
          </Col>
        </Row>
      );
    }
  }

  showModal() {
    if (this.props.pantryDetailMode) {
      return (
        <OneClickReserveModal
          username={this.props.username}
          cartQuantity={this.state.cartQuantity}
          pantry={this.props.pantry}
          foodItem={this.props.foodItem}
          show={this.state.showOneClickReserveModal}
          onHide={() => this.setShowOneClickReserveModal(false)}
        />
      );
    }
  }

  render() {
    if (this.props.type === "filler")
      return <Card className="filler food-item" />;
    else {
      const { food_id, food_name, quantity } = this.props.foodItem;
      return (
        <>
          <Card className="food-item">
            <Card.Body>
              <Card.Title className="mb-4">
                <Row className="justify-content-between align-items-center">
                  <Col className="text-left">
                    <span id="food_name">{food_name}</span>
                  </Col>
                  <Col className="text-right">
                    {/* Show if Item is in stock */}
                    {this.showStockInfo()}
                  </Col>
                </Row>
                {this.showReserveControls()}
                {this.showAdminControls()}
                {this.showWishlistControls()}
                {this.showCartControls()}
                {this.showPantryName()}
              </Card.Title>
            </Card.Body>
          </Card>
          {this.showModal()}
        </>
      );
    }
  }
}

export default FoodItemCard;
