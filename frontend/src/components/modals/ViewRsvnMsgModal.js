import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ViewRsvnMsgModal(props) {
  const usernameStyle = {
    fontFamily: "monospace",
    fontSize: "140%",
    fontWeight: "450",
  };

  const rsvnDetaillStyle = {
    fontFamily: "monospace",
  };

  const rsvn = props.state.rsvns;

  // const contents = Object.entries(rsvn.reserved_items).map(([key, value]) => (
  //   <li key={key}>
  //     {props.state.pantryDetails.foods[key].food_name}: {value}
  //   </li>
  // ));

  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="ViewRsvnMsgModal" centered>
        <Modal.Header closeButton>
          <Modal.Title id="ViewRsvnMsgModal">
            Reservation for User{" "}
            <span style={usernameStyle}>{rsvn.username}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Reservation Detail (
            <span style={rsvnDetaillStyle}>Food Name: Quantity</span>)
          </h5>
          {/* {contents} */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewRsvnMsgModal;
