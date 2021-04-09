import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import FoodItemCard from './WishListItemCard';

import { connect } from 'react-redux';
import { fetchWishList } from '../actions/wishlistActions';


class WishListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foods: null
    }
  }

  componentDidMount() {
      this.setState({foods: this.props.fetchWishList()});
  }


  /**
   * Returns a list of <WishListItemCard> instances,
   * based on the list of food items fetched from the API.
   *
   */
  getFoodItemCards(){
    let foodItemCards = [];
    for (const foodItem of this.state.foods) {
      foodItemCards.push(
        <WishListItemCard
          key={foodItem.food_id}
          foodItem={foodItem}
          removeItem={this.removeItem.bind(this)}
          updateItemQuantity={this.updateItemQuantity.bind(this)}
        />
      )
    }

    // Use filler card to align cards correctly.
    // This prevents a single card on the last row from being centered.
    if (foodItemCards.length % 2) {
      foodItemCards.push(<FoodItemCard type="filler" />)
    }

    return foodItemCards;
  }



  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <h2>Wish List</h2>
        </Row>
        <Row className="justify-content-center">

        </Row>
        <Row className="justify-content-center">
          {this.getFoodItemCards()}
        </Row>
      </Container>
    );
  }
}

WishListView.propTypes = {
  fetchWishList: PropTypes.func.isRequired,
  wishlist: PropTypes.object
}

// Takes in the state and returns an object
const mapStateToProps = (state) => ({
  wishlist: state.foods, // it's state.pantries because the index reducer specifies this reducer as 'pantries'
});

const mapFunctionToProps = {
  fetchWishList
}


export default connect(mapStateToProps, mapFunctionToProps)(WishListView);
