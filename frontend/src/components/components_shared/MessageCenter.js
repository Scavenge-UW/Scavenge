import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// import for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
// import { Typeahead } from "react-bootstrap-typeahead";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from "reactstrap";

// import for components
import EditEstModal from "../modals/EditEstModal";
import ViewRsvnMsgModal from "../modals/ViewRsvnMsgModal";

// import for services
import PantryService from "../../services/pantry.service";
import ReservationService from "../../services/reservation.service";

// other imports
import Fuse from "fuse.js"; // for searching reservations
import "../../css/common.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// imports for helper functions
import FooterMsg from "../helper_functions/FooterMsg";
import MySpinner from "../helper_functions/MySpinner";
import msgFunctions from "../helper_functions/msgAndBtns.function";
import ScrollToTop from "../helper_functions/ScrollToTop.function";

/**
 * Message view for admin/staff to view all of
 * their reservation messages in pagination.
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */
function MessageCenter(props) {
  // get pantry_id/username, either one must be null
  const p = useParams().param;
  let pantry_id;
  let username;

  if (props.isAdmin()) {
    pantry_id = parseInt(p);
    username = null;
  } else {
    pantry_id = null;
    username = p;
  }

  const [pantryDetail, setPantryDetail] = useState(null); // pantry info
  const [userRsvns, setUserRsvns] = useState(null); // user reservation info

  // show reservation message, default false
  const [showRsvnMsg, setShowRsvnMsg] = useState(false);

  // used for spinner
  const [isLoaded, setIsLoaded] = useState(false);

  // used to passing information to ViewRsvnMsgModal
  const [selectedID, setSelectedID] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedApproved, setSelectedApproved] = useState(null);
  const [selectedPickedUp, setSelectedPickedUp] = useState(null);
  const [selectedCancelled, setSelectedCancelled] = useState(null);
  const [selectedResFoods, setSelectedResFoods] = useState(null);
  // used by EditEstModal
  const [showEditEst, setShowEditEst] = useState(null);
  const [selectedEstPickup, setSelectedEstPickup] = useState(null);

  // pagination
  const [currPage, setCurrPage] = useState(1);
  const paginationCount = 10;

  // search result
  const [searchResult, setSearchResult] = useState([]);

  // tabs
  const [tab, setTab] = useState("all");

  useEffect(() => {
    fetchResponse();
  }, []);

  /**
   * Fetch pantry detail/user reservation based on logged in user type
   *
   */
  const fetchResponse = async () => {
    setIsLoaded(false);
    if (username) {
      // load user reservation if username is not null
      const response = await ReservationService.getUserReservations(username);
      setUserRsvns(response.reservations);
    } else {
      // load pantry detail if pantry_id is not null
      const detail = await PantryService.getDetail(pantry_id);
      setPantryDetail(detail);
    }
    setIsLoaded(true);
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
   * opens edit est pickup time modal
   */
  const openEditEstModal = () => {
    setShowEditEst(true);
  };

  /**
   * closes edit est pickup time modal
   */
  const closeEditEstModal = () => {
    setShowEditEst(false);
  };

  /**
   * update est pickup time
   *
   * @param {*} estTime - desire est pickup time to update
   */
  const updateEstPickupTime = (estTime) => {
    msgFunctions.setEstPickupTime(selectedID, estTime, pantry_id, () =>
      fetchResponse()
    );
    setSelectedEstPickup(estTime);
  };

  /**
   * Show control buttons for admin mode
   */
  const showControls = (rsvn) => {
    // enable approved button
    const approveButton = !msgFunctions.approvedButtonIsHidden(rsvn) && ( // Approve this reservation Button
      <Button
        // variant="outline-primary"
        variant="primary"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          if (window.confirm("Approve this reservation?")) {
            setSelectedID(rsvn.reservation_id);
            setSelectedApproved(rsvn.approved);
            msgFunctions.markAsApproved(rsvn.reservation_id, pantry_id, () =>
              fetchResponse()
            );
          }
        }}
      >
        Approve this reservation
      </Button>
    );

    // enable mark as picked up button
    const markAsPickedUpButton = !msgFunctions.pickedupButtonIsHidden(rsvn) && (
      // {/* Mark as Picked Up Button */}
      <Button
        // variant="outline-success"
        variant="success"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          if (window.confirm("Mark this reservation as picked up?")) {
            setSelectedID(rsvn.reservation_id);
            setSelectedPickedUp(rsvn.picked_up_time);
            msgFunctions.markAsPickedUp(rsvn.reservation_id, pantry_id, () =>
              fetchResponse()
            );
          }
        }}
      >
        Mark as Picked up
      </Button>
    );

    // enable cancel reservation button
    const cancelReservationButton = !msgFunctions.cancelButtonIsHidden(
      rsvn
    ) && (
      // {/* Cancel this reservation Button */}
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
            msgFunctions.markAsCancelled(rsvn.reservation_id, pantry_id, () =>
              fetchResponse()
            );
          }
        }}
      >
        Cancel this reservation
      </Button>
    );

    // enable reset button
    const resetButton = !msgFunctions.resetButtonIsHidden(rsvn) && (
      <Button
        variant="dark"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          if (window.confirm("Reset and approve this reservation?")) {
            setSelectedID(rsvn.reservation_id);
            setSelectedCancelled(rsvn.cancelled);
            msgFunctions.markAsApproved(rsvn.reservation_id, pantry_id, () =>
              fetchResponse()
            );
          }
        }}
      >
        Reset and Approve
      </Button>
    );

    // edit estimated puckup time button
    const editEstButton = !msgFunctions.editEstButtonIsHidden(rsvn) && (
      <Button
        variant="dark"
        size="sm"
        className="m-2"
        md="auto"
        onClick={() => {
          setSelectedID(rsvn.reservation_id);
          openEditEstModal();
          // updateEstPickupTime(rsvn.estimated_pick_up);
        }}
      >
        Edit Estimated Pickup Time
      </Button>
    );

    // enable withdraw button
    const withdrawButton = !msgFunctions.cancelButtonIsHidden(rsvn) && (
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
            msgFunctions.markWithDraw(rsvn.reservation_id, rsvn.pantry_id, () =>
              fetchResponse()
            );
          }
        }}
      >
        Withdraw this reservation
      </Button>
    );

    if (username) return [withdrawButton]; // food seeker user

    // admin user
    return [
      approveButton,
      markAsPickedUpButton,
      cancelReservationButton,
      resetButton,
      editEstButton,
    ];
  };

  /**
   * search with fuse.js
   *
   * @param {*} pattern
   * @returns
   */
  const searchData = (pattern) => {
    if (pantryDetail || userRsvns) {
      // -------------------------- search with fuse --------------------------
      let rsvns = username ? [...userRsvns] : [...pantryDetail.reservations];

      if (!pattern) return; // return empty search result

      // Perform fuzzy search for pantries
      const fuse = new Fuse(rsvns, {
        keys: ["reservation_id", "username", "res_foods.res_food_name"],
        // includeMatches: true,
        threshold: 0.0,
      });
      const result = fuse.search(pattern);

      if (!result.length) return; // No matches

      let filtered = [];
      result.forEach(({ item }) => {
        filtered.push(item);
      });
      setSearchResult([...filtered]);

      // -------------------------- render search result --------------------------
      console.log(searchResult);
    }
  };

  const renderSearchForm = () => {
    return (
      <Container>
        <Row className="justify-content-center mt-4">
          <Col className="text-center">
            <h4>Search for Messages</h4>
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <input
            className="SearchInput w-responsive w-25"
            type="text"
            onChange={(e) => searchData(e.target.value)}
            placeholder="Search by name or location"
          />
          <span className="SearchSpan">
            <FontAwesomeIcon className="pin" icon={faSearch} />
          </span>
        </Row>
      </Container>
    );
  };

  /**
   * filtered messages, sort by reservation_id in descending order, and slice by page,
   * and return a list of ListGroupItems containing reservation messages (header, status, etc)
   *
   * @param {*} selectedTab - Tabs for 'To Be Approved', 'Approved Reservations', 'Cancelled Reservations', 'Complete Reservations'
   * @returns
   */
  const getMessageItems = (selectedTab) => {
    let msgListItems = [];
    let rsvns = [];
    if (selectedTab !== "search") {
      if (pantryDetail || userRsvns)
        rsvns = username
          ? [...userRsvns]
          : [...pantryDetail.reservations]
              // condition for tabs to load messages based on rsvn status
              .filter((rsvn) => {
                if (selectedTab === "all") return rsvn;
                if (selectedTab === "not_approved")
                  return !rsvn.approved && !rsvn.cancelled;
                if (selectedTab === "approved")
                  return (
                    rsvn.approved && !rsvn.picked_up_time && !rsvn.cancelled
                  );
                if (selectedTab === "cancelled") return rsvn.cancelled;
                if (selectedTab === "complete")
                  return (
                    rsvn.approved && rsvn.picked_up_time && !rsvn.cancelled
                  );
              })
              .sort((a, b) => b.reservation_id - a.reservation_id)
              .slice(
                (currPage - 1) * paginationCount,
                paginationCount * currPage
              );
    } else {
      rsvns = [...searchResult]
        .sort((a, b) => b.reservation_id - a.reservation_id)
        .slice((currPage - 1) * paginationCount, paginationCount * currPage);
    }

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
            {username
              ? // food seeker user
                msgFunctions.getMessageHeader(
                  rsvn,
                  false, // adminMode
                  "/pantries/" + rsvn.pantry_id // weblink
                )
              : // admin user
                msgFunctions.getMessageHeader(rsvn, true)}
          </ListGroupItemHeading>
          <hr />
          {/* Body (status) */}
          <ListGroupItemText>
            {
              username
                ? // food seeker user
                  msgFunctions.getMessageStatus(rsvn, null) // rsvn, time_to_add
                : // admin user
                  msgFunctions.getMessageStatus(rsvn, pantryDetail.time_to_add) // rsvn, time_to_add
            }
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
            approved/pickedup/cancelled/reset buttons for admin mode
            */}
            {showControls(rsvn)}
          </Row>
        </ListGroupItem>
      );
    }
    return msgListItems;
  };

  /**
   * push messages into pagination
   *
   * @param {*} selectedTab - Tabs to filter messages based on user status
   */
  const showPagination = (selectedTab) => {
    let numItems;
    if (selectedTab !== "search") {
      if (username) {
        // food seeker user
        numItems = userRsvns
          ? Object.values(
              userRsvns
                // condition for tabs to load messages based on rsvn status
                .filter((rsvn) => {
                  if (selectedTab === "search") return searchResult;
                  if (selectedTab === "all") return rsvn;
                  if (selectedTab === "not_approved")
                    return !rsvn.approved && !rsvn.cancelled;
                  if (selectedTab === "approved")
                    return (
                      rsvn.approved && !rsvn.picked_up_time && !rsvn.cancelled
                    );
                  if (selectedTab === "cancelled") return rsvn.cancelled;
                  if (selectedTab === "complete")
                    return (
                      rsvn.approved && rsvn.picked_up_time && !rsvn.cancelled
                    );
                })
            ).length
          : 0;
      } else {
        // admin user
        numItems = pantryDetail
          ? Object.values(
              pantryDetail.reservations.filter((rsvn) => {
                if (selectedTab === "all") return rsvn;
                if (selectedTab === "not_approved")
                  return !rsvn.approved && !rsvn.cancelled;
                if (selectedTab === "approved")
                  return (
                    rsvn.approved && !rsvn.picked_up_time && !rsvn.cancelled
                  );
                if (selectedTab === "cancelled") return rsvn.cancelled;
                if (selectedTab === "complete")
                  return (
                    rsvn.approved && rsvn.picked_up_time && !rsvn.cancelled
                  );
              })
            ).length
          : 0;
      }
    } else {
      numItems = [...searchResult].length;
      console.log("numItems = ", numItems);
    }

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

  /**
   * render message in ListGroupItems and display in pagination.
   *
   * @param {*} selectedTab - Tabs for 'To Be Approved', 'Approved Reservations', 'Cancelled Reservations', 'Complete Reservations'
   */
  const renderMsg = (selectedTab) => {
    return (
      <>
        <ListGroup className="w-responsive w-75 mx-auto">
          <Row className="justify-content-center mt-4">
            {/* top pagination */}
            {showPagination(selectedTab)}
          </Row>
          {/* <ViewMessages /> */}
          <Row className="justify-content-center">
            {getMessageItems(selectedTab)}
          </Row>
          <Row className="justify-content-center mt-4">
            {/* buttom pagination */}
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

        {/* Edit Est Pickup Time Modal */}
        <EditEstModal
          show={showEditEst}
          selectedEstPickup={selectedEstPickup}
          updateEstPickupTime={(estTime) => updateEstPickupTime(estTime)}
          onHide={() => closeEditEstModal()}
        />
      </>
    );
  };

  /**
   * categorized messages by tab and displayed by tab based on reservation status
   */
  const MsgTab = () => {
    if (isLoaded) {
      return (
        <Container id="all_reservations">
          {username
            ? // food seeker user
              msgFunctions.getMessageOverviewAndTitle(userRsvns, null, false) // rsvn, pantry_name, adminMode
            : // admin user
              msgFunctions.getMessageOverviewAndTitle(
                pantryDetail.reservations,
                pantryDetail.name,
                true
              )}
          <Tabs
            id="rsvns-tab"
            variant="pills"
            defaultActiveKey={tab}
            onSelect={(t) => {
              setTab(t);
              setCurrPage(1); // set page to 1 on tab-click
            }}
            className="justify-content-center nav-justified mb-4 mt-4"
          >
            <Tab eventKey="search" title={<strong>Search Messages</strong>}>
              <Row>{renderSearchForm()}</Row>
              <Row className="mt-4">
                <Col className="text-center">
                  <h5>found {searchResult.length}</h5>
                </Col>
              </Row>
              <hr />
              {renderMsg("search")}
            </Tab>
            <Tab
              eventKey="all"
              title={
                <strong>
                  {username ? "All Reservations" : "All Messages"}
                </strong>
              }
            >
              <hr />
              {renderMsg("all")}
            </Tab>
            <Tab
              eventKey="not_approved"
              title={<strong>{username ? "Pending" : "To Be Approved"}</strong>}
            >
              <hr />
              {renderMsg("not_approved")}
            </Tab>
            <Tab
              eventKey="approved"
              title={<strong>{username ? "Need Pickup" : "Approved"}</strong>}
            >
              <hr />
              {renderMsg("approved")}
            </Tab>
            <Tab
              eventKey="cancelled"
              title={<strong>{username ? "Need Pickup" : "Cancelled"}</strong>}
            >
              <hr />
              {renderMsg("cancelled")}
            </Tab>
            <Tab eventKey="complete" title={<strong>Complete</strong>}>
              <hr />
              {renderMsg("complete")}
            </Tab>
          </Tabs>

          {/* footer message */}
          <Row className="justify-content-center">
            <FooterMsg />
          </Row>
        </Container>
      );
    }

    return (
      <Container id="all-reservations-loading">
        <MySpinner />
      </Container>
    );
  };

  return MsgTab();
}

export default MessageCenter;
