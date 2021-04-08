import React, { Component } from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import FoodItemCard from "./FoodItemCard";

function CartView(props) {
  const cart = useSelector((store) => store.cart);

  const cartItems =
    cart.length >= 1 ? (
      cart.map((item) => {
        return (
          <Row className="ml-5 mr-5 align-items-center">
            <Col>
              <FoodItemCard
                cartMode
                foodItem={item.item}
                cartQuantity={item.cartQuantity}
                pantry={item.pantry}
              />
            </Col>
          </Row>
        );
      })
    ) : (
      <Row className="ml-5 mr-5 justify-content-center align-items-center">
        <h4>Your cart is empty.</h4>
      </Row>
    );

  const onClickCheckout = () => {
    let reservationsByPantries = {};

    cart.forEach((item) => {
      const pantry_id = item.pantry.pantry_id;
      const food_id = item.item.food_id;
      const quantity = parseInt(item.cartQuantity);
      if (pantry_id in reservationsByPantries) {
        reservationsByPantries[pantry_id].push([food_id, quantity]);
      } else {
        reservationsByPantries[pantry_id] = [[food_id, quantity]];
      }
    });

    console.log(reservationsByPantries);

    Object.keys(reservationsByPantries).forEach((pantry_id) => {
      let food_ids = [];
      let quantities = [];
      reservationsByPantries[pantry_id].forEach((item) => {
        food_ids.push(item[0]);
        quantities.push(item[1]);
      });

      let data = {
        food_ids: food_ids,
        quantities: quantities,
      };

      console.log(data);
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Row className="text-center justify-content-center mb-3">
            <h1>Cart</h1>
          </Row>
          {cartItems}
          <Row xs={5} md={4} lg={3} className="mt-4 justify-content-center">
            <Button onClick={onClickCheckout} size="lg" block>
              Checkout
            </Button>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CartView;
