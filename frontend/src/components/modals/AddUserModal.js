import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

function AddUserModal(props){
    
    const [username, setUsername] = useState("");


    useEffect(() => {
        if (!props.show) {
          clearForm();
        }
      });

      const clearForm = () => {
        setUsername("");
      };

      const addUser = () => {
        props.setItemToBeAdded({
          username: username,
        });
    
        props.onHide(); // close the modal
      };

      return (
        <Modal {...props} size="lg" aria-labelledby="addItemModal" centered>
          <Modal.Header closeButton>
            <Modal.Title id="addItemModal">Add a user to food pantry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    id="user-name"
                    type="text"
                    placeholder="Please enter a valid username (e.g. Sean3)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button id="btn-modal-add-item" onClick={addUser}>
              Add User
            </Button>
          </Modal.Footer>
        </Modal>
      );


}

export default AddUserModal;
