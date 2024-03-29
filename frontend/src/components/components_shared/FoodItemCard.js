import React, { Component } from "react";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

// other imports
import "../../css/common.css";
import { toast } from "react-toastify";
import { VscCircleFilled } from "react-icons/vsc";
import { BsInfoCircle } from "react-icons/bs";

// imports for actions and helper function
import store from "../../store";
import FoodService from "../../services/food.service";
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
      errors: {}, // used by validating input form forquantity
      editMode: false,
      showOneClickReserveModal: false,
      cartQuantity: 0,
      decrementBtnDisabled: true,
      foodsInfo: [],
    };
  }

  // used to load food info to display food nutrition info
  componentDidMount() {
    this.fetchFoodsInfo();
  }

  fetchFoodsInfo() {
    FoodService.getFoods().then((foods) => {
      this.setState({
        foodsInfo: foods,
      });
    });
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

  /**
   * Return nutrition tooltip and on hover over display nutrition index
   *
   * @returns nutrition tool tip on hover over
   */
  showNutritionTooltip() {
    const getNutrition = (id) => {
      if (this.state.foodsInfo.length) {
        for (const info of this.state.foodsInfo) {
          if (id === info.id) return info.NUTRITION_COLUMNS_PLACEHOLDER;
        }
      }
      return -1;
    };

    const renderTooltip = () => (
      <Tooltip id="nutrition-info-tooltip">
        <strong>
          Nutrition index: {getNutrition(this.props.foodItem.food_id)}
        </strong>
      </Tooltip>
    );

    return (
      <OverlayTrigger
        placement="right"
        delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
        overlay={renderTooltip()}
      >
        <BsInfoCircle
          size="1.3rem"
          color="#48AAAD"
          onClick={() => {
            console.log("hello");
          }}
        />
      </OverlayTrigger>
    );
  }

  setShowOneClickReserveModal(show) {
    this.setState({
      showOneClickReserveModal: show,
    });
  }

  onClickOneClickReserve() {
    const input = Math.floor(parseInt(this.cartQuantity.current.value));
    // ------ validating:
    let allErrors = null;
    // validation for quantity number
    if (
      input < 0 || // must be positive
      input === null || // not bu null
      !Number.isInteger(input) // is a number
    ) {
      allErrors = {};
      allErrors.quantity = "Please provide a valid quantity number.";
    }
    if (allErrors) {
      this.setState({ errors: allErrors });
      return;
    }
    // ------ done validating

    // process input data with logged in status and server
    if (!this.props.isLoggedIn()) {
      toast.info("Please log in to reserve items.");
    } else if (this.props.isAdmin()) {
      toast.error(
        "You are currently logged in as Admin. Only Civilian Users can reserve items."
      );
    } else {
      this.setShowOneClickReserveModal(true);
      this.setState({
        cartQuantity: input,
        errors: {},
      });
    }
  }

  onClickAddToCart() {
    const input = Math.floor(parseInt(this.cartQuantity.current.value));
    // ------ validating:
    let allErrors = null;
    // validation for quantity number
    if (
      input < 0 || // must be positive
      input === null || // not bu null
      !Number.isInteger(input) // is a number
    ) {
      allErrors = {};
      allErrors.quantity = "Please provide a valid quantity number.";
    }
    if (allErrors) {
      this.setState({ errors: allErrors });
      return;
    }
    // ------ done validating

    // process input data with logged in status and server
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
          cartQuantity: input,
          pantry: this.props.pantry,
        })
      );
      toast.info("🛒 " + itemName + " was added to your cart!");

      this.setState({ erros: {} });
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
    const input = Math.floor(parseInt(this.newQuantity.current.value));
    // ------ validating:
    let allErrors = null;
    // validation for quantity number
    if (
      input < 0 || // must be positive
      input === null || // not bu null
      !Number.isInteger(input) // is a number
    ) {
      allErrors = {};
      allErrors.quantity = "Please provide a valid quantity number.";
    }
    if (allErrors) {
      this.setState({ errors: allErrors });
      return;
    }
    // ------ done validating

    let itemName = this.props.foodItem.food_name;
    let food_id = this.props.foodItem.food_id;

    if (window.confirm("Are you sure you want to update " + itemName + "?")) {
      PantryService.updateFoodItem(1, food_id, {
        quantity: input,
      })
        .then(() => {
          toast.success(itemName + "'s quantity was successfully updated!");
          this.props.updateItemQuantity(food_id, input);
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
            <Button
              block
              onClick={() => {
                this.setState({ errors: {} });
                this.onClickUpdateItemQuantity();
              }}
            >
              Update
            </Button>
          </Col>
          <Col>
            <Button
              id="btn-cancel-edit-quantity"
              block
              variant="danger"
              onClick={() => {
                this.setState({ errors: {} });
                this.deactivateEditMode();
              }}
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
                    isInvalid={!!this.state.errors.quantity} // used for form control feedback to validate
                  />
                </Form.Group>
                <Form.Control.Feedback type="invalid">
                  {this.state.errors.quantity}
                </Form.Control.Feedback>
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
        <>
          <Row className="mt-2 mb-3 justify-content-center">
            <Col>
              <Row className="text-center">
                <Form.Label column="sm">Quantity to Reserve</Form.Label>
              </Row>
              <Row className="text-center justify-content-center">
                <InputGroup className="mt-1 w-responsive w-50" md="auto">
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
                        if (parseInt(this.cartQuantity.current.value) > 1)
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
                    required
                    min="1" // VALIDATE: set min to 1
                    type="number"
                    ref={this.cartQuantity}
                    defaultValue={1}
                    onChange={() => {
                      this.setState({ errors: {} });
                      this.onUpdateCartItemQuantity();
                      // VALIDATE: disabled decrement button accordingly
                      if (parseInt(this.cartQuantity.current.value) < 2)
                        this.setState({ decrementBtnDisabled: true });
                      else this.setState({ decrementBtnDisabled: false });
                    }}
                    isInvalid={!!this.state.errors.quantity} // used for form control feedback to validate
                    disabled={!this.isInStock()}
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
                        if (parseInt(this.cartQuantity.current.value) < 2)
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
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.quantity}
                  </Form.Control.Feedback>
                </InputGroup>
              </Row>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {/* display One Click Reserve buttons if item is in stock */}
            {this.isInStock() && (
              <Button
                id="btn-one-click-reserve"
                variant="success"
                type="submit"
                className="m-2"
                onClick={() => {
                  this.setState({ errors: {} });
                  this.onClickOneClickReserve();
                }}
              >
                One Click Reserve
              </Button>
            )}
            {/* display Add to Cart buttons if item is in stock */}
            {this.isInStock() && (
              <Button
                id="btn-add-to-cart"
                variant="info"
                type="submit"
                className="m-2"
                onClick={() => {
                  this.setState({ errors: {} });
                  this.onClickAddToCart();
                }}
              >
                Add to Cart
              </Button>
            )}
            {/* display Add to Wishlist buttons if item is out of stock */}
            {!this.isInStock() && (
              <Button
                id="btn-add-to-wishlist"
                variant="dark"
                type="submit"
                className="m-2"
                onClick={this.onClickAddToWishlist.bind(this)}
              >
                Add to Wishlist
              </Button>
            )}
          </Row>
        </>
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
                        // increment cartQuantity by 1
                        this.cartQuantity.current.value =
                          parseInt(this.cartQuantity.current.value) + 1;
                        // set decrement button to enabled if quantity > 0
                        if (parseInt(this.cartQuantity.current.value) > 1)
                          this.setState({ decrementBtnDisabled: false });
                        this.onUpdateCartItemQuantity();
                      }}
                      disabled={!this.isInStock()}
                    >
                      +
                    </Button>
                  </InputGroup.Prepend>
                  {/* TODO: validate valid input quantity number */}
                  <FormControl
                    type="number"
                    defaultValue={this.props.cartQuantity}
                    ref={this.cartQuantity}
                    min="1" // test
                    onChange={() => {
                      this.setState({ errors: {} });
                      this.onUpdateCartItemQuantity();
                      // VALIDATE: disabled decrement button accordingly
                      if (parseInt(this.cartQuantity.current.value) < 2)
                        this.setState({ decrementBtnDisabled: true });
                      else this.setState({ decrementBtnDisabled: false });
                    }}
                    isInvalid={!!this.state.errors.quantity} // used for form control feedback to validate
                  />
                  <InputGroup.Append>
                    <Button
                      className="decrement-cart-item"
                      variant="outline-primary"
                      onClick={() => {
                        // decrement cartQuantity by 1
                        this.cartQuantity.current.value =
                          parseInt(this.cartQuantity.current.value) - 1;
                        // VALIDATE: set decrement button to disabled if quantity <= 1
                        if (parseInt(this.cartQuantity.current.value) < 2)
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
                  <Form.Control.Feedback type="invalid">
                    {this.state.errors.quantity}
                  </Form.Control.Feedback>
                </InputGroup>
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
              <Card.Title className="mb-3">
                <Row className="justify-content-between align-items-center">
                  <Col className="text-left">
                    <span>
                      <span id="food_name">{food_name}</span>{" "}
                      {this.showNutritionTooltip()}
                    </span>
                  </Col>
                  <Col className="text-right">
                    {/* Show if Item is in stock */}
                    {this.showStockInfo()}
                  </Col>
                </Row>
              </Card.Title>
              {this.showReserveControls()}
              {this.showAdminControls()}
              {this.showWishlistControls()}
              {this.showCartControls()}
              {this.showPantryName()}
            </Card.Body>
          </Card>
          {this.showModal()}
        </>
      );
    }
  }
}

export default FoodItemCard;
