import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// import for bootstrap
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";

// import for components
import ViewRsvnMsgModal from "../modals/ViewRsvnMsgModal";

// import for services
import PantryService from "../../services/pantry.service";
import ReservationService from "../../services/reservation.service";

// other imports
import "../../css/common.css";
import { toast } from "react-toastify";

// imports for helper functions
import FooterMsg from "../helper_functions/FooterMsg";
import MySpinner from "../helper_functions/MySpinner";
import msgFunctions from "../helper_functions/msgAndBtns.function";
import ScrollToTop from "../helper_functions/ScrollToTop.function";

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

  // tabs
  const [tab, setTab] = useState("all");

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
    // enabel cancel button
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

  const getMessageItems = (selectedTab) => {
    let msgListItems = [];
    let rsvns = [];
    if (userRsvns)
      rsvns = Object.values(userRsvns)
        // condition for tabs to load messages based on rsvn status
        .filter((rsvn) => {
          if (selectedTab === "all") return rsvn;
          if (selectedTab === "not_approved")
            return !rsvn.approved && !rsvn.cancelled;
          if (selectedTab === "approved")
            return rsvn.approved && !rsvn.picked_up_time && !rsvn.cancelled;
          if (selectedTab === "cancelled") return rsvn.cancelled;
          if (selectedTab === "complete")
            return rsvn.approved && rsvn.picked_up_time && !rsvn.cancelled;
        })
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
            {msgFunctions.getMessageStatus(rsvn, false)}
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

  /**
   * put messages into pagination
   *
   * @param {*} selectedTab - Tabs for 'Pending Reservations', 'Need Pickup', 'Cancelled Reservations', 'Complete Reservations'
   */
  const showPagination = (selectedTab) => {
    let numItems = userRsvns
      ? Object.values(
          userRsvns
            // condition for tabs to load messages based on rsvn status
            .filter((rsvn) => {
              if (selectedTab === "all") return rsvn;
              if (selectedTab === "not_approved")
                return !rsvn.approved && !rsvn.cancelled;
              if (selectedTab === "approved")
                return rsvn.approved && !rsvn.picked_up_time && !rsvn.cancelled;
              if (selectedTab === "cancelled") return rsvn.cancelled;
              if (selectedTab === "complete")
                return rsvn.approved && rsvn.picked_up_time && !rsvn.cancelled;
            })
        ).length
      : 0;
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

    // previous button
    paginationItems.unshift(
      <Pagination.Prev
        onClick={() => {
          setCurrPage(currPage - 1);
        }}
        disabled={currPage === 1}
      />
    );
    // go to page 1 button
    paginationItems.unshift(
      <Pagination.First
        onClick={() => {
          setCurrPage(1);
        }}
        disabled={currPage === 1}
      />
    );
    // next page button
    paginationItems.push(
      <Pagination.Next
        onClick={() => {
          setCurrPage(currPage + 1);
        }}
        disabled={currPage === numPages}
      />
    );
    // go to last page button
    paginationItems.push(
      <Pagination.Last
        onClick={() => {
          setCurrPage(numPages);
        }}
        disabled={currPage === numPages}
      />
    );

    return paginationItems.length > 0 ? (
      <Pagination>{paginationItems}</Pagination>
    ) : (
      <>
        <h4>You have 0 reservation here</h4>
      </>
    );
  };

  /**
   * render message in ListGroupItems and display in pagination.
   *
   * @param {*} selectedTab - Tabs for 'Pending Reservations', 'Need Pickup', 'Cancelled Reservations', 'Complete Reservations'
   */
  const renderMsg = (selectedTab) => {
    if (userRsvns) {
      return (
        <>
          <ListGroup className="w-responsive w-75 mx-auto mt-4">
            {/* <ViewMessages /> */}
            <Row className="justify-content-center">
              {getMessageItems(selectedTab)}
            </Row>
            <Row className="justify-content-center mt-4">
              {showPagination(selectedTab)}
            </Row>
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
        </>
      );
    }
  };

  /**
   * categorized messages by tab and displayed by tab based on reservation status
   */
  const userAllMsgTab = () => {
    if (userRsvns) {
      return (
        <Container id="user-reservations">
          {msgFunctions.getMessageOverviewAndTitle(userRsvns, null, false)}
          <Tabs
            id="admin-all-rsvns-tab"
            variant="pills"
            defaultActiveKey={tab}
            onSelect={(t) => {
              setTab(t);
              setCurrPage(1); // set page to 1 on tab-click
            }}
            className="justify-content-center nav-justified mb-4 mt-4"
          >
            <Tab eventKey="all" title={<strong>All Reservations</strong>}>
              {renderMsg("all")}
            </Tab>
            <Tab eventKey="not_approved" title={<strong>Pending</strong>}>
              {renderMsg("not_approved")}
            </Tab>
            <Tab eventKey="approved" title={<strong>Need Pickup</strong>}>
              {renderMsg("approved")}
            </Tab>
            <Tab eventKey="cancelled" title={<strong>Cancelled</strong>}>
              {renderMsg("cancelled")}
            </Tab>
            <Tab eventKey="complete" title={<strong>Complete</strong>}>
              {renderMsg("complete")}
            </Tab>
          </Tabs>

          {/* footer message */}
          <Row className="justify-content-center">
            <FooterMsg />
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
  };

  return userAllMsgTab();
}

export default Dashboard_userAllMsg;
