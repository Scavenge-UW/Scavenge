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
            {/* Reservation for User <span style={usernameStyle}>hi</span> */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Reservation Detail #{props.selectedID}
            {/* (<span style={rsvnDetailStyle}>Food Name: Quantity</span>) */}
          </h5>
          <hr />
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
          {/* debug purpose - TODO: reomve this paragraph */}
          {/* <p>
            reservation ID: {props.selectedID} <br />
            Marked As Approved: {props.selectedApproved} <br />
            Marked As Picked Up:{" "}
            {props.selectedPickedUp ? props.selectedPickedUp : `null`} <br />
            Marked As Cancelled: {props.selectedCancelled} <br />
          </p> */}
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
