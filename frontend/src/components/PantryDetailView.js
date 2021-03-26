import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { useParams } from "react-router-dom";

import PantryService from '../services/pantry.service';

/**
 * A view for user that displays details and food items in a specific pantry.
 * 
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */

 function PantryDetailView() {  
  const [pantryDetail, setPantryDetail] = useState(null);
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

  if (pantryDetail !== null) {
    const { name, address, zip, city, state, lat, lon,
      phone_number, details, img_src, website } = pantryDetail;

    const formatted_phone_number = formatPhoneNumber(phone_number)

    return (
      <Container>
        <Row className="justify-content-center mt-4 mb-4">
          <Col className="rounded bg-light">
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
                    <strong>Website: </strong> &nbsp; <a href="{website}">{website}</a>
                  </Row>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col>
            <Image className="rounded" src={img_src} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <h2>Available Items</h2>
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