import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ViewRsvnMsgModal(props) {
  const usernameStyle = {
    fontFamily: "monospace",
    fontSize: "140%",
    fontWeight: "450",
  };

  const rsvnDetailStyle = {
    fontFamily: "monospace",
  };

  // const getInfo = props.rsvns.filter(
  //   (info) => info.reservation_id === props.selectedID
  // );

  // console.log("getInfo = ", { ...getInfo });

  // const info = { ...getInfo }[0];

  // console.log("info = ", { info });
  // console.log("username.getInfo = ", getInfo[0].username);
  // console.log("approved.getInfo = ", getInfo.approved);
  // console.log("username.info = ", info.username);
  // console.log("approved.info = ", info.approved);

  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="ViewRsvnMsgModal" centered>
        <Modal.Header closeButton>
          <Modal.Title id="ViewRsvnMsgModal">
            Reservation for User{" "}
            <span style={usernameStyle}>{props.selectedUsername}</span>
            {/* Reservation for User <span style={usernameStyle}>hi</span> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Reservation Detail (
            <span style={rsvnDetailStyle}>Food Name: Quantity</span>)
          </h5>
          <hr />
          {/* debug purpose - TODO: reomve this paragraph */}
          <p>
            reservation ID: {props.selectedID} <br />
            Marked As Picked Up: {props.selectedApproved}
          </p>
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
