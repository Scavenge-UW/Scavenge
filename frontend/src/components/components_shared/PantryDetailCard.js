import React, { Component } from "react";
import { Link } from "react-router-dom";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

// other imports
import "../../css/common.css";
import { toast } from "react-toastify";

class PantryCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  showFoods() {
    return this.props.pantry.foods.map((food) => {
      return (
        <tr>
          <td>{food.food_name}</td>
          <td>{food.quantity}</td>
        </tr>
      );
    });
  }

  /**
   * Returns a full address of a pantry
   *
   */
  getAddress() {
    let address = "";
    address += this.props.pantry.address + ", ";
    address += this.props.pantry.city + ", ";
    address += this.props.pantry.state + " ";
    address += this.props.pantry.zip;

    return address;
  }

  render() {
    if (this.props.type === "filler") {
      return <Card className="filler food-item" />;
    } else {
      const { pantry_id, name, website } = this.props.pantry;
      return (
        <>
          <Card className="food-item">
            <Card.Body>
              <Card.Title className="mb-4">
                <Row className="justify-content-between align-items-center">
                  <Link push to={"/pantries/" + pantry_id}>
                    {name}
                  </Link>
                </Row>
              </Card.Title>
              <Row>
                <p>
                  <strong>Address: </strong>
                  <span>{this.getAddress()}</span>
                </p>
              </Row>
              <Table>
                <tr>
                  <th>Food</th>
                  <th>Quantity</th>
                </tr>
                {this.showFoods()}
              </Table>
            </Card.Body>
          </Card>
        </>
      );
    }
  }
}

export default PantryCard;
