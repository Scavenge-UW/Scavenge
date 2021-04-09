import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { VscCircleFilled } from "react-icons/vsc";

import '../css/common.css'

class WishListItemCard extends Component {
  constructor(props) {
    super(props);

    this.newQuantity = React.createRef();
    this.state = {
      editMode: false
    }
  }

  /**
   * Return if the item is in stock.
   *
   * @returns {boolean} true if the item is in stock, false if out of stock
   */
  isInStock(){
    return this.props.foodItem.quantity > 0
  }

  /**
   * Display current stock information.
   *
   * @returns an HTML object that consists of stock info along with visual icon
   */
  showStockInfo() {
    if (this.isInStock()){
      return (
        <>
          In Stock
          <VscCircleFilled color="green" />
        </>
      )
    } else {
      return (
        <>
          Out of Stock
          <VscCircleFilled color="red" />
        </>
      )
    }
  }

  /**
   * Ask for delete confirmation and remove the item.
   *
   */
  onClickRemoveItem() {
    let itemName = this.props.foodItem.food_name;
    let food_id = this.props.foodItem.food_id;

    if (window.confirm("Are you sure you want to delete " + itemName + "?")){
      // TODO: send delete request to the server

      this.props.removeItem(food_id)
    }
  }


  render() {
    if (this.props.type === "filler"){
        return (
          <Card className="filler food-item" />
        )
    } else {
        const { food_id, food_name, quantity } = this.props.foodItem;
        return (
          <Card className="food-item">
            <Card.Body>
              <Card.Title className="mb-4">
                <Row className="justify-content-between align-items-center">
                  <Col className="text-left">
                    {food_name}
                  </Col>
                  <Col className="text-right">
                    {/* Show if Item is in stock */}
                    {this.showStockInfo()}
                  </Col>
                </Row>
              </Card.Title>
              </Card.Body>
          </Card>
        );
    }
  }
}

export default WishListItemCard;
