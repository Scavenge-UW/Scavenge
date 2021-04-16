import React, { useEffect, useState, forwardRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import moment from "moment";
import { toast } from "react-toastify";

import ReservationService from "../../services/reservation.service";

// A modal where user can add an item in the pantry
function OneClickReserveModal(props) {
  const onClickProceed = () => {
    let data = {
      username: props.username,
      estimated_pick_up: moment(new Date())
        .add(1, "hours")
        .format("YYYY-MM-DD HH:mm:ss"), // TODO: currently, estimated pickup time is set to 1 hour from now
      food_ids: [props.foodItem.food_id],
      quantities: [props.cartQuantity],
    };

    ReservationService.makeReservation(props.pantry.pantry_id, data)
      .then(() => {
        toast.info("Reserved " + props.foodItem.food_name + "!");
      })
      .catch(() => {
        toast.error(
          "There was an error while making a reservation. Please try again later."
        );
      })
      .finally(() => {
        props.onHide();
      });
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="addItemModal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="addItemModal">
          One Click Reserve Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Pantry</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{props.foodItem.food_name}</td>
              <td>{props.cartQuantity}</td>
              <td>{props.pantry.name}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClickProceed}>Proceed</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OneClickReserveModal;
