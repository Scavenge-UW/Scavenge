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

// other imports
import "../css/common.css";
import { toast } from "react-toastify";
import msgFunctions from "./functions/msgAndBtns.function"; // message helper functions
import ScrollToTop from "./functions/ScrollToTop.function";

/**
 * Message view for admin/staff to view all of
 * their reservation messages in pagination.
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */
function Dashboard_adminAllMsg(props) {
  const [pantryDetail, setPantryDetail] = useState(null); // pantry info

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

  // get pantry_id in route param
  const { pantry_id } = useParams();
  console.log({ ...useParams() });

  /**
   * Fetch pantry detail on init
   *
   */
  useEffect(() => {
    fetchPantryDetail();
  }, []);

  /**
   * Fetch pantry detail
   *
   */
  const fetchPantryDetail = async () => {
    let detail = await PantryService.getDetail(pantry_id); // TODO: change pantry id based on user's affiliation
    setPantryDetail(detail);
  };

  /**
   * Mark a reservation as approved
   *
   * @param {*} rsvn_id
   */
  const markAsApproved = (rsvn_id) => {
    console.log(rsvn_id);
    PantryService.setApproved(pantry_id, rsvn_id)
      .then(() => {
        fetchPantryDetail(); // push changes to be displayed by re-rendered
        toast.success(
          "You have successfully approved the reservation with ID " + rsvn_id
        );
      })
      .catch(() => {
        toast.error("Error while approving reservation with ID " + rsvn_id);
      });
  };

  /**
   * Mark a reservation as picked up
   *
   * @param {*} rsvn_id
   */
  const markAsPickedUp = (rsvn_id) => {
    console.log(rsvn_id);
    PantryService.setPickedUp(pantry_id, rsvn_id)
      .then(() => {
        fetchPantryDetail(); // push changes to be displayed by re-rendered
        toast.success(
          "reservation with ID " +
            rsvn_id +
            " was successfully marked as picked up!"
        );
      })
      .catch(() => {
        toast.error(
          "Error while marking reservation with ID " +
            rsvn_id +
            " as picked up."
        );
      });
  };

  /**
   * Mark a reservation as cancelled
   *
   * @param {*} rsvn_id
   */
  const markAsCancelled = (rsvn_id) => {
    console.log(rsvn_id);
    PantryService.setCancelled(pantry_id, rsvn_id)
      .then(() => {
        fetchPantryDetail(); // push changes to be displayed by re-rendered
        toast.success(
          "You have successfully cancelled the reservation with ID " + rsvn_id
        );
      })
      .catch(() => {
        toast.error("Error while cancelling reservation with ID " + rsvn_id);
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
   * Show control buttons for admin mode
   */
  const showControls = (rsvn) => {
    var controls;
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
            markAsApproved(rsvn.reservation_id);
          }
        }}
      >
        Approve this reservation
      </Button>
    );

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
            markAsPickedUp(rsvn.reservation_id);
          }
        }}
      >
        Mark as Picked up
      </Button>
    );

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
            markAsCancelled(rsvn.reservation_id);
          }
        }}
      >
        Cancel this reservation
      </Button>
    );

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
            markAsApproved(rsvn.reservation_id);
          }
        }}
        disabled={false}
      >
        Reset and Approve
      </Button>
    );

    controls = [
      approveButton,
      markAsPickedUpButton,
      cancelReservationButton,
      resetButton,
    ];

    return controls;
  };

  const getMessageItems = () => {
    let msgListItems = [];
    let rsvns = [];
    if (pantryDetail)
      rsvns = [...pantryDetail.reservations]
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
            {msgFunctions.getMessageHeader(rsvn, true)}
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
            approved/pickedup/cancelled/reset buttons for admin mode
            */}
            {showControls(rsvn)}
          </Row>
        </ListGroupItem>
      );
    }
    return msgListItems;
  };

  const showPagination = () => {
    let numItems = pantryDetail
      ? Object.values(pantryDetail.reservations).length
      : 0;
    // if (pantryDetail)
    //   numItems = Object.values(pantryDetail.reservations).length;
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

  if (pantryDetail === null) {
    return <div class="spinner" />;
  }

  return (
    <Container>
      <ListGroup className="w-responsive w-75 mx-auto">
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
          Time is Money. We provide an efficient way for you to update available
          items.
        </p>
      </Row>
    </Container>
  );
}

export default Dashboard_adminAllMsg;
