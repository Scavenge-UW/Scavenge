import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

// A modal where user can add an item in the pantry
function AddItemModal(props) {
  // States for the form
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Clear the form on modal close.
  useEffect(() => {
    if (!props.show) {
      clearForm();
    }
  });

  /**
   * Initializes the states used for the form.
   * Should be used when an item is added,
   * or when user closes the modal.
   */
  const clearForm = () => {
    setName("");
    setQuantity(1);
  }

  /**
   * Submit the form to the server to add the item.
   * This method is called when user clicks the "Add Item" button in the modal.
   * 
   */
  const addItem = () => {
    // TODO: send add request to API
    let food_id = Math.floor(Math.random() * 100)+1

    props.setItemToBeAdded({
      food_id: food_id,
      name: name,
      quantity: quantity,
    })

    props.onHide(); // close the modal
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="addItemModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="addItemModal">
            Add an item to food pantry
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              id="item-name"
              type="text"
              placeholder="Name of the item (e.g. Apple)" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Form.Group>
        </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={addItem}>Add item</Button>
      </Modal.Footer>
    </Modal>
    )
}

export default AddItemModal;
