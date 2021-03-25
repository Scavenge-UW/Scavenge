import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ViewRsvnMsgModal(props) {
  const [show, setShow] = useState(props.show);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-info" onClick={handleShow}>
        View Message
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="ViewRsvnMsgModal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="ViewRsvnMsgModal">Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* TODO: separate items: quantity by a new line  */}
          {Object.entries(props.messageContent).map(
            ([key, value]) => `${key}: ${value} \n`
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewRsvnMsgModal;
