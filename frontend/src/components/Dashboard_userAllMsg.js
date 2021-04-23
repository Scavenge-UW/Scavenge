import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// import for bootstrap
import Pagination from "react-bootstrap/Pagination";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";

// import for components
import ViewRsvnMsgModal from "./modals/ViewRsvnMsgModal";

// import for services
import PantryService from "../services/pantry.service";
import ReservationService from "../services/reservation.service";

// other imports
import "../css/common.css";
import { toast } from "react-toastify";

// imports for helper functions
import MySpinner from "./helper_functions/MySpinner";
import msgFunctions from "./helper_functions/msgAndBtns.function";
import ScrollToTop from "./helper_functions/ScrollToTop.function";

/**
 * Message view for user to view all of
 * the user's reservation history in pagination.
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */
function Dashboard_userAllMsg(props) {
  const [userRsvns, setUserRsvns] = useState(null); // user reservation info

  // show reservation message, default false
  const [showRsvnMsg, setShowRsvnMsg] = useState(false);

  // used to passing information to ViewRsvnMsgModal
  const [selectedID, setSelectedID] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedApproved, setSelectedApproved] = useState(null);
  const [selectedPickedUp, setSelectedPickedUp] = useState(null);
  const [selectedCancelled, setSelectedCancelled] = useState(null);
  const [selectedResFoods, setSelectedResFoods] = useState(null);

  // pagination
  const [currPage, setCurrPage] = useState(1);
  const paginationCount = 10;

  // get username in route param
  const { username } = useParams();
  console.log({ ...useParams() });

  /**
   * Fetch user reservation info on init
   *
   */
  useEffect(() => {
    fetchRsvnResponse();
  }, []);

  /**
   * Fetch user reservation info
   */
  const fetchRsvnResponse = async () => {
    const response = await ReservationService.getUserReservations(username);
    setUserRsvns(response.reservations);
  };

  /**
   * Mark a reservation as withdrawed
   *
   * @param {*} rsvn_id
   */
  const markWithDraw = (pantry_id, rsvn_id) => {
    console.log(rsvn_id);
    PantryService.setCancelled(pantry_id, rsvn_id)
      .then(() => {
        fetchRsvnResponse(); // push changes to be displayed by re-rendered
        toast.success(
          "You have successfully withdrawed your reservation with ID " + rsvn_id
        );
      })
      .catch(() => {
        toast.error(
          "Error while withdrawing your reservation with ID " + rsvn_id
        );
      });
  };

  /**
   * Opens View Reservation Message modal.
   *
   */
  const openViewRsvnMsgModal = () => {
    setShowRsvnMsg(true);
  };

  /**
   * Closes View Reservation Message modal.
   *
   */
  const closeViewRsvnMsgModal = () => {
    setShowRsvnMsg(false);
  };

  /**
   * Show control buttons for user mode
   */
  const showControls = (rsvn) => {
    const cancelReservationButton = !msgFunctions.cancelButtonIsHidden(
      rsvn
    ) && (
      // {/* Withdraw this reservation Button */}
      <Button
        // variant="outline-danger"
        variant="danger"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          if (window.confirm("Cancel this reservation?")) {
            setSelectedID(rsvn.reservation_id);
            setSelectedCancelled(rsvn.cancelled);
            markWithDraw(rsvn.pantry_id, rsvn.reservation_id);
          }
        }}
      >
        Withdraw this reservation
      </Button>
    );

    return [cancelReservationButton];
  };

  const getMessageItems = () => {
    let msgListItems = [];
    let rsvns = [];
    if (userRsvns)
      rsvns = Object.values(userRsvns)
        .sort((a, b) => b.reservation_id - a.reservation_id)
        .slice((currPage - 1) * paginationCount, paginationCount * currPage);

    for (const rsvn of rsvns) {
      msgListItems.push(
        <ListGroupItem
          tag="a"
          className="justify-content-center p-3 mt-1"
          key={rsvn.reservation_id}
          action
        >
          {/* Heading */}
          <ListGroupItemHeading className="mb-1">
            {msgFunctions.getMessageHeader(
              rsvn,
              false, // adminMode
              "/pantries/" + rsvn.pantry_id // weblink
            )}
          </ListGroupItemHeading>
          <hr />
          {/* Body (status) */}
          <ListGroupItemText>
            {msgFunctions.getMessageStatus(rsvn)}
          </ListGroupItemText>

          <Row className="justify-content-center align-items-center">
            {/* Veiw Message Buttons */}
            <Button
              // variant="outline-secondary"
              variant="secondary"
              size="sm"
              className="m-2"
              md="auto"
              onClick={() => {
                setSelectedID(rsvn.reservation_id);
                setSelectedUsername(rsvn.username);
                setSelectedApproved(rsvn.approved);
                setSelectedPickedUp(rsvn.picked_up_time);
                setSelectedCancelled(rsvn.cancelled);
                setSelectedResFoods(rsvn.res_foods);
                openViewRsvnMsgModal();
              }}
            >
              View Reserved Foods
            </Button>

            {/*
            withdraw buttons for userMode
            */}
            {showControls(rsvn)}
          </Row>
        </ListGroupItem>
      );
    }
    return msgListItems;
  };

  const showPagination = () => {
    let numItems = userRsvns ? Object.values(userRsvns).length : 0;
    // if (userRsvns) numItems = Object.values(userRsvns).length;
    let numPages = Math.ceil(numItems / paginationCount);
    let paginationItems = [];

    for (let pageNo = 1; pageNo <= numPages; pageNo++) {
      paginationItems.push(
        <Pagination.Item
          key={pageNo}
          active={pageNo === currPage}
          onClick={() => {
            setCurrPage(pageNo);
          }}
        >
          {pageNo}
        </Pagination.Item>
      );
    }

    return <Pagination>{paginationItems}</Pagination>;
  };

  if (userRsvns) {
    return (
      <Container id="user-reservations">
        {msgFunctions.getMessageOverviewAndTitle(userRsvns, null, true)}
        <ListGroup className="w-responsive w-75 mx-auto mt-4">
          {/* <ViewMessages /> */}
          <Row className="justify-content-center">{getMessageItems()}</Row>
          <Row className="justify-content-center mt-4">{showPagination()}</Row>
        </ListGroup>

        {/* Scroll to top button */}
        <Row className="justify-content-center mt-4">
          <ScrollToTop scrollStepInPx="100" delayInMs="10.50" />
        </Row>

        {/* Reservation Message Modal */}
        <ViewRsvnMsgModal
          show={showRsvnMsg}
          selectedID={selectedID}
          selectedUsername={selectedUsername}
          selectedApproved={selectedApproved}
          selectedPickedUp={selectedPickedUp}
          selectedCancelled={selectedCancelled}
          selectedResFoods={selectedResFoods}
          onHide={() => closeViewRsvnMsgModal()}
        />

        {/* footer message */}
        <Row className="justify-content-center">
          <p className="mt-4">
            Time is Money. We provide an efficient way for you to update
            available items.
          </p>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container id="user-reservations-loading">
        <MySpinner />
      </Container>
    );
  }
}

export default Dashboard_userAllMsg;
