import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import { useParams } from "react-router-dom";

import FoodItemCard from '../components/FoodItemCard';
import PantryService from '../services/pantry.service';

/**
 * A view for user that displays details and food items in a specific pantry.
 * 
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */

 function PantryDetailView() {  
  const [pantryDetail, setPantryDetail] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const paginationCount = 10;
  const { pantry_id } = useParams(); // get pantry_id in route param 

  /**
   * Fetch pantry detail on init
   * 
   */
   React.useEffect(() => {
    fetchPantryDetail();
  }, [])


  /**
   * Fetch pantry detail
   * 
   */
  const fetchPantryDetail = async () => {
    const detail = await PantryService.getDetail(pantry_id); // TODO: change pantry id based on user's affiliation
    setPantryDetail(detail);
  }

  /**
   * Format a phone_number string to US phone number format
   * 
   * @param {string} phone_number 
   * @returns {string} formatted US phone number
   */
  const formatPhoneNumber = (phone_number) => {
    var cleaned = ('' + phone_number).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return phone_number;
  }

  /**
   * Returns a list of <FoodItemCard> instances, 
   * based on the list of food items.
   * 
   */ 
   const getFoodItemCards = () => {
    let foodItemCards = [];
    const foods = Object.values(pantryDetail.foods).slice(1+(currPage-1)*paginationCount, paginationCount*currPage+1)
    for (const foodItem of Object.values(foods)) { // TODO: Change to props when API is implemented
      foodItemCards.push(
        <FoodItemCard
          key={foodItem.food_id}
          foodItem={foodItem}
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
  
  const showPagination = () => {
    let numItems = Object.values(pantryDetail.foods).length;
    let numPages = Math.ceil(numItems / paginationCount);
    let paginationItems = [];

    for (let pageNo = 1; pageNo <= numPages; pageNo++){
      paginationItems.push(
        <Pagination.Item
          key={pageNo}
          active={pageNo === currPage}
          onClick={() => {setCurrPage(pageNo)}}
        >
          {pageNo}
        </Pagination.Item>
      )
    }

    return (
      <Pagination>
        {paginationItems}
      </Pagination>
    )
  }

  if (pantryDetail !== null) {
    const { name, address, zip, city, state, lat, lon,
      phone_number, details, img_src, website } = pantryDetail;

    const formatted_phone_number = formatPhoneNumber(phone_number)

    return (
      <Container>
        <Row className="justify-content-center mt-4 mb-4">
          <Col className="justify-content-center rounded bg-light">
            <Row className="justify-content-center mt-3">
              <h3>Welcome to {name}</h3>
            </Row>
            <Row className="justify-content-center">
              <h5>{details}</h5>
            </Row>
            <Container>
              <Row className="mt-4 ml-4">
                <Col>
                  <Row>
                    <strong>Address:</strong> &nbsp; {address}, {city}, {state} {zip}
                  </Row>
                  <Row>
                    <strong>Phone: </strong> &nbsp; {formatted_phone_number}
                  </Row>
                  <Row>
                    <strong>Website: </strong> &nbsp; <a href={website} target="_blank">{website}</a>
                  </Row>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col className="justify-content-center">
            <Image className="rounded" src={img_src} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <h2>Available Items</h2>
        </Row>
        <Row className="justify-content-center">
          {getFoodItemCards()}
        </Row>
        <Row className="justify-content-center mt-4">
          {showPagination()}
        </Row>
      </Container>
    );
  } else {
    return (
    <Container>
      <div class="spinner"></div>
    </Container>
    )
  }
}

export default PantryDetailView;