import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ViewRsvnMsgModal(props) {
  // const

  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="ViewRsvnMsgModal" centered>
        <Modal.Header closeButton>
          {/* TODO: adding a Modal Title and time when the reservation is made. */}
          <Modal.Title id="ViewRsvnMsgModal">"Hi"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* TODO: print reservation detail separated (items: quantity) by a new line  */}
          hi
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
