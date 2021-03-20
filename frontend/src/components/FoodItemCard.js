import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { VscCircleFilled } from "react-icons/vsc";

import '../css/common.css'

class FoodItemCart extends Component {
  constructor(props) {
    super(props);
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
    let itemName = this.props.foodItem.name;
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
        const { food_id, name, quantity } = this.props.foodItem;
        return (
          <Card className="food-item">
            <Card.Body>
              <Card.Title className="mb-4">
                <Row className="justify-content-between align-items-center">
                  <Col className="text-left">
                    {name}
                  </Col>
                  <Col className="text-right">
                    {/* Show if Item is in stock */}
                    {this.showStockInfo()}
                  </Col>
                </Row>
              </Card.Title>
              <hr />
                <Row>
                  <Col>
                    <Form>
                      <Form.Group controlId="formQuantity">
                        <Form.Label>Enter quantity in stock</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Quantity"
                          value={quantity}
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                  <Col>
                    {/* Empty label is for aligning the input and the button */}
                    <Form.Label>&nbsp;</Form.Label> 
                    <Button block>Update</Button>
                  </Col>
                </Row>
                <Row>
                  <Button
                    className="ml-3 mr-3"
                    block
                    variant="outline-danger"
                    onClick={this.onClickRemoveItem.bind(this)}
                  >
                    Remove
                  </Button>
                </Row>
              </Card.Body>
          </Card>
        );
    }
  }
}

export default FoodItemCart;