import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

function AddUserModal(props){
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [email, setEmail] = useState("");


    useEffect(() => {
        if (!props.show) {
          clearForm();
        }
      });

      const clearForm = () => {
        setUsername("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setPhone("");
        setAddress("");
        setCity("");
        setState("");
        setZipcode("");
        setEmail("");
      };

      const addUser = () => {
        props.setItemToBeAdded({
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          address: address,
          city: city,
          state: state,
          zipcode: zipcode,
          email: email
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

                <Form.Group as={Col}>
                  <Form.Label>Password</Form.Label>
                    <Form.Control
                      id="user-pass"
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
              </Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    id="first-name"
                    type="text"
                    value={firstName}
                    onChange={(e)=> setFirstName(e.target.value)}
                  />
                </Form.Group>
              
              <Form.Row>
                <Form.Group as={Col}> 
                  <Form.Control
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e)=> setLastName(e.target.value)}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}> 
                    <Form.Control
                        id="phone"
                        type="text"
                        value={phone}
                        onChange={(e)=> setPhone(e.target.value)}
                    />
                  </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}> 
                    <Form.Control
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e)=> setAddress(e.target.value)}
                    />
                  </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}> 
                    <Form.Control
                        id="phone"
                        type="text"
                        value={phone}
                        onChange={(e)=> setPhone(e.target.value)}
                    />
                  </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}> 
                    <Form.Control
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e)=> setCity(e.target.value)}
                    />
                  </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}> 
                    <Form.Control
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e)=> setState(e.target.value)}
                    />
                  </Form.Group>
              </Form.Row>
                 
              <Form.Row>
                <Form.Group as={Col}> 
                    <Form.Control
                        id="state"
                        type="text"
                        value={state}
                        onChange={(e)=> setState(e.target.value)}
                    />
                  </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}> 
                    <Form.Control
                        id="zipcode"
                        type="text"
                        value={zipcode}
                        onChange={(e)=> setZipcode(e.target.value)}
                    />
                  </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col}> 
                    <Form.Control
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
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
