import React, { Component } from "react";
import { Link } from "react-router-dom";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

// other imports
import "../../css/common.css";

class SearchResultPantryCard extends Component {
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
      return (
        <Card
          className="filler food-item"
          border="dark"
          style={{ width: "18rem" }}
        />
      );
    } else {
      const { pantry_id, name } = this.props.pantry;
      return (
        <>
          <Card className="food-item" border="dark" style={{ width: "18rem" }}>
            <Card.Header as="h5">
              <Row className="justify-content-between align-items-center">
                <Link push to={"/pantries/" + pantry_id}>
                  {name}
                </Link>
              </Row>
            </Card.Header>
            <Card.Body style={{ padding: "0" }}>
              <Table>
                <tr>
                  <th>Food</th>
                  <th>Quantity</th>
                </tr>
                {this.showFoods()}
              </Table>
            </Card.Body>
            <Card.Footer className="text-muted">
              <strong>Address: </strong>
              <span>{this.getAddress()}</span>
            </Card.Footer>
          </Card>
        </>
      );
    }
  }
}

export default SearchResultPantryCard;
