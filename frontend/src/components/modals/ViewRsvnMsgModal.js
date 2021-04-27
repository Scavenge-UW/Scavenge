import React from "react";
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

  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="ViewRsvnMsgModal" centered>
        <Modal.Header closeButton>
          <Modal.Title id="ViewRsvnMsgModal">
            Reservation for User{" "}
            <span style={usernameStyle}>{props.selectedUsername}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* only render the list if selectedResFoods is not `undefined` */}
          {props.show && (
            <ul>
              {props.selectedResFoods.map((item) => (
                <li key={item.res_food_id}>
                  <span style={rsvnDetailStyle}>
                    <strong>{item.res_food_name}</strong>:{" "}
                    {item.res_food_quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
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
