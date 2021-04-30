import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

// A modal where user can add an item in the pantry
function AddItemModal(props) {
  // States for the form
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  // Clear the form on modal close.
  useEffect(() => {
    if (!props.show) {
      clearForm();
    }
  }, [props.show]);

  /**
   * Initializes the states used for the form.
   * Should be used when an item is added,
   * or when user closes the modal.
   */
  const clearForm = () => {
    setName(null);
    setQuantity(null);
    setErrors({});
  };

  /**
   * Submit the form to the server to add the item.
   * This method is called when user clicks the "Add Item" button in the modal.
   *
   */
  const addItem = () => {
    props.setItemToBeAdded({
      food_name: name,
      quantity: Math.floor(quantity),
    });

    props.onHide(); // close the modal
  };

  /**
   * handle validation on form submit
   *
   * @param {*} e - event
   */
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    let allErrors = null;
    // validation for number
    if (
      quantity < 0 || // must be positive
      quantity === null || // not bu null
      !Number.isInteger(parseInt(quantity)) // is a number
    ) {
      allErrors = {};
      allErrors.quantity = "Please provide a valid quantity number.";
    }
    // validation for name
    if (name.length < 1 || name === null) {
      allErrors = {};
      allErrors.name = "Please provide a name for the item.";
    }

    if (allErrors) {
      setErrors(allErrors);
      return;
    }
    addItem();
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="addItemModal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="addItemModal">Add an item to food pantry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                id="item-name"
                type="text"
                placeholder="Name of the item (e.g. Apple)"
                value={name}
                isInvalid={!!errors.name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                required
                id="item-quantity"
                type="number"
                placeholder="quantity (i.e. a number)"
                value={quantity}
                isInvalid={!!errors.quantity} // used for form control feedback to validate
                onChange={(e) => setQuantity(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.quantity}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          id="btn-modal-add-item"
          type="submit"
          onClick={handleSubmit}
          disabled={name === null && quantity === null}
        >
          Add item
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddItemModal;
