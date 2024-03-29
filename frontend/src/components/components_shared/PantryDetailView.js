import React, { useState } from "react";
import { useParams } from "react-router-dom";

// imports for bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import Image from "react-bootstrap/Image";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";

// imports for services and components
import FoodItemCard from "./FoodItemCard";
import PantryService from "../../services/pantry.service";

// imports for helper functions
import formatters from "../helper_functions/DatetimeFormatter.function";
import MySpinner from "../helper_functions/MySpinner";

/**
 * A view for user that displays details and food items in a specific pantry.
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 */

function PantryDetailView(props) {
  const [pantryDetail, setPantryDetail] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [tab, setTab] = useState("information");
  const paginationCount = 10;
  const { pantry_id } = useParams(); // get pantry_id in route param

  /**
   * Fetch pantry detail on init
   *
   */
  React.useEffect(() => {
    fetchPantryDetail();
  }, []);

  /**
   * Fetch pantry detail and food information
   *
   */
  const fetchPantryDetail = async () => {
    const detail = await PantryService.getDetail(pantry_id); // TODO: change pantry id based on user's affiliation
    setPantryDetail(detail);
  };

  /**
   * Format a phone_number string to US phone number format
   *
   * @param {string} phone_number
   * @returns {string} formatted US phone number
   */
  const formatPhoneNumber = (phone_number) => {
    var cleaned = ("" + phone_number).replace(/\D/g, "");
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      var intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return phone_number;
  };

  /**
   * Returns a list of <FoodItemCard> instances,
   * based on the list of food items.
   *
   */
  const getFoodItemCards = () => {
    let foodItemCards = [];
    const foods = Object.values(pantryDetail.foods).slice(
      (currPage - 1) * paginationCount,
      paginationCount * currPage
    );

    for (const foodItem of Object.values(foods)) {
      // TODO: Change to props when API is implemented
      foodItemCards.push(
        <FoodItemCard
          pantryDetailMode
          isLoggedIn={props.isLoggedIn}
          isAdmin={props.isAdmin}
          username={props.username}
          key={foodItem.food_id}
          foodItem={foodItem}
          pantry={pantryDetail}
          numFoodItems={foodItemCards.length}
        />
      );
    }

    // Use filler card to align cards correctly.
    // This prevents a single card on the last row from being centered.
    if (foodItemCards.length % 2) {
      foodItemCards.push(<FoodItemCard type="filler" />);
    }

    return foodItemCards;
  };

  const showPagination = () => {
    let numItems = Object.values(pantryDetail.foods).length;
    let numPages = Math.ceil(numItems / paginationCount);
    let paginationItems = [];

    for (let pageNo = 1; pageNo <= numPages; pageNo++) {
      paginationItems.push(
        <Pagination.Item
          key={pageNo}
          active={pageNo === currPage}
          onClick={() => {
            setCurrPage(pageNo);
            window.scrollTo(0, 0); // move page to top
          }}
          className="mr-1"
        >
          {pageNo}
        </Pagination.Item>
      );
    }

    // previous button
    paginationItems.unshift(
      <Pagination.Prev
        onClick={() => {
          setCurrPage(currPage - 1);
          window.scrollTo(0, 0); // move page to top
        }}
        disabled={currPage === 1}
        className="mr-1"
      />
    );
    // go to page 1 button
    paginationItems.unshift(
      <Pagination.First
        onClick={() => {
          setCurrPage(1);
          window.scrollTo(0, 0); // move page to top
        }}
        disabled={currPage === 1}
        className="mr-1"
      />
    );
    // next page button
    paginationItems.push(
      <Pagination.Next
        onClick={() => {
          setCurrPage(currPage + 1);
          window.scrollTo(0, 0); // move page to top
        }}
        disabled={currPage === numPages}
        className="mr-1"
      />
    );
    // go to last page button
    paginationItems.push(
      <Pagination.Last
        onClick={() => {
          setCurrPage(numPages);
          window.scrollTo(0, 0); // move page to top
        }}
        disabled={currPage === numPages}
        className="mr-1"
      />
    );

    return <Pagination>{paginationItems}</Pagination>;
  };

  const showPantryInfo = () => {
    const {
      address,
      zip,
      city,
      state,
      phone_number,
      website,
      details,
    } = pantryDetail;

    const formatted_phone_number = formatPhoneNumber(phone_number);

    return (
      <Row>
        <Col className="ml-4 mt-2">
          <Row>
            <strong>Description:</strong> &nbsp; {details}
          </Row>
          <Row>
            <strong>Address:</strong> &nbsp; {address}, {city}, {state} {zip}
          </Row>
          <Row>
            <strong>Phone: </strong> &nbsp; {formatted_phone_number}
          </Row>
          <Row>
            <strong>Website: </strong> &nbsp;{" "}
            <a href={website} target="_blank">
              {website}
            </a>
          </Row>
        </Col>
      </Row>
    );
  };

  const showPantryHours = () => {
    Object.values(pantryDetail.hours);
    const daysOfTheWeek = {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    };

    let items = [];
    for (const hours of Object.values(pantryDetail.hours)) {
      items.push(
        <tr key={hours.day}>
          <td>{daysOfTheWeek[hours.day]}</td>
          <td>{formatters.time(hours.open)}</td>
          <td>{formatters.time(hours.close)}</td>
          <td>{hours.detail}</td>
        </tr>
      );
    }

    return (
      <Table striped hover size="sm">
        <thead>
          <tr>
            <th>Day</th>
            <th>Opens</th>
            <th>Closes</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </Table>
    );
  };

  if (pantryDetail) {
    const {
      name,
      // unused: address,zip,city,state,lat,lon,phone_number,website,
      img_src,
    } = pantryDetail;

    return (
      <Container id="pantry-detail-view">
        <Row className="justify-content-center mt-4 mb-4 bg-light">
          <Col className="justify-content-center rounded">
            <Row className="justify-content-center mt-3 text-center">
              <h3>{name}</h3>
            </Row>
            <Row className="justify-content-center mx-auto mb-4">
              <img
                src={img_src}
                className="img-fluid"
                alt="holder.js/100px240"
              />
            </Row>
          </Col>
          <Col>
            <Row className="mt-2 ml-4 mb-4">
              <Tabs
                style={{ width: "100%" }}
                id="operating-hours"
                activeKey={tab}
                onSelect={(t) => setTab(t)}
              >
                <Tab eventKey="information" title="Information">
                  {showPantryInfo()}
                </Tab>
                <Tab eventKey="operating_hours" title="Operating Hours">
                  {showPantryHours()}
                </Tab>
              </Tabs>
            </Row>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <h2>Available Items</h2>
        </Row>
        {/* top pagination */}
        <Row className="justify-content-center mt-4">{showPagination()}</Row>
        <Row className="justify-content-center">{getFoodItemCards()}</Row>
        {/* buttom pagination */}
        <Row className="justify-content-center mt-4">{showPagination()}</Row>
      </Container>
    );
  }
  return (
    <Container id="pantry-detail-view-loading">
      <MySpinner />
    </Container>
  );
}

export default PantryDetailView;
