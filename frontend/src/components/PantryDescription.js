import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';



export default class PantryDescription extends Component {
    constructor(props) {
        super(props);
        this.state={
            showModal: false,
            description:""
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleClick(){
        this.setState({showModal: true})
    }
    
    handleClose(){
      this.setState({showModal: false})
    }

    handleSave(){
        //make update api call to update description
        this.setState({showModal:false})
        this.props.updateDesc(this.state.description)
    }



    render() {
        return (
            <Card>
               <Card.Header>Pantry Description</Card.Header> 
               <Card.Body>
                    <Card.Text>{this.props.description}</Card.Text>
                    <Button variant="success" onClick={this.handleClick}>Edit</Button>
                       <Modal show={this.state.showModal} onHide={this.handleClose}>

                        <Modal.Header closeButton>
                            <Modal.Title>Edit Food Pantry Description</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Enter new description in text area</Form.Label>
                                    <Form.Control as="textarea" rows={5} onChange={(e)=>this.setState({description: e.target.value})} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                            
                        <Modal.Footer>
                        <Button variant="danger" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="success" onClick={this.handleSave}>
                            Save Changes
                        </Button>
                        </Modal.Footer>

                    </Modal>
               </Card.Body>
            </Card>
        )
    }
}
