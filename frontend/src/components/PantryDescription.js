import React, { Component } from 'react';
import Card from "react-bootstrap/Card";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PantryService from '../services/pantry.service'



export default class PantryDescription extends Component {
    constructor(props) {
        super(props);
        this.state={
            showModal: true,
            pantryInfo:"",
            pantryId:1,
            name:"",
            address:"",
            city:"",
            state:"",
            zip:"",
            phone_number:"",
            details:"",
            img_src:"",
            website:"" 
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount(){
        //going to pass in pantryId from app.js
        const {  }
        PantryService.getDetail(this.state.pantryId).then((response)=>{this.setState({pantryInfo: response})})
        this.setState({
            this.props.pantryDesc
        })
    }

    handleClick(){
        this.setState({showModal: true})
    }
    
    handleClose(){
      this.setState({showModal: false})
    }

    handleSave(){
        //make update api call to update description
        const pantry = {
            name: this.state.name,
            address: this.state.address,
            city: this.state.city,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
            phone_number: this.state.phone_number,
            details: this.state.details,
            img_src: this.state.img_src,
            website: this.state.website
        }
        this.setState({showModal:false})
        PantryDescription.updateDetail(pantry,this.state.pantryId,this.state.token)
    }



    render() {
        return (
            <Card>
               <Card.Header>Pantry Description</Card.Header> 
               <Card.Body>
                 <Card.Img variant="top" src={this.state.img_src} />
                    <Card.Text>
                        <p> {"Name: " + this.state.pantryInfo.name} </p>
                        <p> {"Address: " + this.state.pantryInfo.address} </p>
                        <p> {"City: " +  this.state.pantryInfo.city} </p>
                        <p> {"State: " + this.state.pantryInfo.state} </p>
                        <p> {"Zip: " + this.state.pantryInfo.zip} </p>
                        <p> {"Phone Number: " + this.state.pantryInfo.phone_number} </p> 
                        <p> {"Details: " + this.state.pantryInfo.detail} </p>
                        <p> {"Website: " + this.state.pantryInfo.website} </p>
                    </Card.Text>

                    <Button variant="success" onClick={this.handleClick}>Edit</Button>
                       <Modal show={this.state.showModal} onHide={this.handleClose}>

                        <Modal.Header closeButton>
                            <Modal.Title>Edit Food Pantry details</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Form>
                            <Form.Group controlId="formBasicName">
                                <Form.Label>Pantry Name</Form.Label>
                                <Form.Control type="text" placeholder="New Pantry Name" onChange={(e) => this.setState({ name: e.target.value })}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" placeholder="New Address" onChange={(e) => this.setState({ address: e.target.value })} />
                            </Form.Group>

                            <Form.Group controlId="formBasicCity">
                                <Form.Label>City</Form.Label>
                                <Form.Control type="text" placeholder="New City" onChange={(e) => this.setState({ city: e.target.value })} />
                            </Form.Group>

                            <Form.Group controlId="formBasicZip">
                                <Form.Label>Zip</Form.Label>
                                <Form.Control type="text" placeholder="New Zipcode"  onChange={(e) => this.setState({ zip: e.target.value })}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPhone">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="text" placeholder="New Phone Number" onChange={(e) => this.setState({phone_number: e.target.value })} />
                            </Form.Group>
                            
                            <Form.Group controlId="formBasicDetails">
                                <Form.Label>Details</Form.Label>
                                <Form.Control type="text" placeholder="New Phone Number" onChange={(e) => this.setState({ details: e.target.value })} />
                            </Form.Group>

                            <Form.Group controlId="formBasicImage">
                                <Form.Label>Image Source</Form.Label>
                                <Form.Control type="text" placeholder="New Image Source" onChange={(e) => this.setState({ img_src: e.target.value })} />
                            </Form.Group>

                            <Form.Group controlId="formBasicImage">
                                <Form.Label>Website</Form.Label>
                                <Form.Control type="text" placeholder="New Website" onChange={(e) => this.setState({ website: e.target.value })} />
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