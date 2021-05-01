import React from "react";
import { useSelector } from "react-redux";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

// imports for services, components, and actions
import { clearCart } from "../../actions/cart.actions";
import { fetchPantries } from "../../actions/pantryActions";
import ReservationService from "../../services/reservation.service";
import FoodItemCard from "../components_shared/FoodItemCard";

// other imports
import moment from "moment";
import store from "../../store";
import { toast } from "react-toastify";

function CartView(props) {
  const cart = useSelector((store) => store.cart);
  const pantries = useSelector((store) => store.pantries);

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

  const onClickCheckout = async () => {
    let reservationsByPantries = {};

    if (cart.length < 1) {
      toast.error("Add items to cart");
      return;
    }
      
    await store.dispatch(fetchPantries());

    cart.forEach((item) => {
      const pantry_id = item.pantry.pantry_id;
      const food_id = item.item.food_id;
      const quantity = parseInt(item.cartQuantity);

      /// quantity validation
      const actualQuantity = pantries.pantries.result
        .find((e) => {
          return e.pantry_id === pantry_id;
        })
        .foods.find((e) => {
          return e.food_id === food_id;
        }).quantity;
      if (actualQuantity < quantity) {
        toast.error(
          item.item.food_name + " has only " + actualQuantity + " in stock."
        );
        return;
      }

      if (pantry_id in reservationsByPantries) {
        reservationsByPantries[pantry_id].push([food_id, quantity]);
      } else {
        reservationsByPantries[pantry_id] = [[food_id, quantity]];
      }
    });

    Object.keys(reservationsByPantries).forEach((pantry_id) => {
      let food_ids = [];
      let quantities = [];
      reservationsByPantries[pantry_id].forEach((item) => {
        food_ids.push(item[0]);
        quantities.push(item[1]);
      });

      let data = {
        username: props.username,
        estimated_pick_up: moment(new Date())
          .add(1, "hours")
          .format("YYYY-MM-DD HH:mm:ss"), // TODO: currently, estimated pickup time is set to 1 hour from now
        food_ids: food_ids,
        quantities: quantities,
      };

      ReservationService.makeReservation(pantry_id, data)
        .then(() => {
          toast.info("Reservations successful!");
          store.dispatch(clearCart());
        })
        .catch(() => {
          toast.error(
            "There was an error while making a reservation. Please try again later."
          );
        });
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
            <Button
              id="btn-checkout"
              className="mb-4"
              onClick={onClickCheckout}
              size="lg"
              block
            >
              Checkout
            </Button>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default CartView;
