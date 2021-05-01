import React, { useEffect, useState } from "react";

// imports for bootstrap
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/**
 * Edit estimated pickup time modal
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */
function EditEstModal(props) {
  const [estTime, setEstTime] = useState("");

  useEffect(() => {
    if (!props.show) {
      clearForm();
    }
  });

  const clearForm = () => {
    setEstTime("");
  };

  const editEstPickupTime = () => {
    console.log("2. ", estTime);
    props.updateEstPickupTime(estTime);
    props.onHide();
  };

  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="EditEstModal" centered>
        <Modal.Header closeButton>
          <Modal.Title id="EditEstModal">
            Edit Estimated Pickup Time
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.show && (
            <Form>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>New Estimated Pickup Time</Form.Label>
                  <Form.Control
                    id="new-est-pickup-time"
                    type="text"
                    placeholder="YYYY-MM-DD hh:mm:ss (ex. 2021-04-30 12:00:00)"
                    value={estTime}
                    onChange={(e) => setEstTime(e.target.value)}
                  />
                </Form.Group>
              </Form.Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="btn-modal-update-est-pickup-time"
            variant="secondary"
            onClick={editEstPickupTime}
          >
            Update!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditEstModal;
