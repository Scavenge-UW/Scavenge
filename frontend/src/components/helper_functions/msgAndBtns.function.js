/**
 * Helper functions for Messages and functionalities
 * of Buttons like approved/pickedup/cancelled/reset/.
 *
 * @version 1.0.0
 * @author [Ilkyu Ju](https://github.com/osori)
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

import React from "react";
import { Link } from "react-router-dom";

// imports for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// imports for reservation status icons
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";

// imports for service
import PantryService from "../../services/pantry.service";

// other imports
import { toast } from "react-toastify";
import formatters from "./DatetimeFormatter.function"; // time formatters

const monoStyle = {
  fontFamily: "monospace",
  fontSize: "120%",
  fontWeight: "450",
};

const timeElapsedStyle = {
  color: "--gray",
  textAlign: "right",
  fontSize: "60%",
  fontWeight: "300",
  paddingLeft: "2px",
};

const messageStyle = {
  textAlign: "left",
  fontSize: "95%",
  fontWeight: "light",
  paddingLeft: "2px",
};

const keyStyle = {
  textAlign: "right",
  paddingRight: "3px",
  fontWeight: "bold",
  color: "#A9A9A9",
};

const valStyle = {
  textAlign: "left",
  justifyContent: "center",
  paddingLeft: "3px",
  fontFamily: "monospace",
  fontSize: "1.1rem",
};

/**
 * @returns the message header (title and reservation time) for each message.
 */
function getMessageHeader(rsvn, adminMode, weblink = null) {
  const receivedTime = rsvn.order_time;
  const numItems = (
    <span style={monoStyle}>{Object.keys(rsvn.res_foods).length}</span>
  );

  // rsvn needs to be approved
  let icon = <MdRadioButtonUnchecked color="#FF5C00" size="1.65rem" />;

  // rsvn is approved but not picked up yet
  if (rsvn.approved) {
    icon = <IoCheckmarkSharp color="#63C5DA" size="1.8rem" />;
  }
  // rsvn is done (approved and picked up)
  if (rsvn.picked_up_time) {
    icon = <IoCheckmarkDoneSharp color="#03C04A" size="1.8rem" />;
  }

  if (rsvn.cancelled) {
    icon = <ImCancelCircle color="#E3242B" size="1.65rem" />;
  }

  let message;
  if (adminMode) {
    // adminMode
    const username = <span style={monoStyle}>{rsvn.username}</span>;
    message = (
      <>
        {icon} User {username} just reserved {numItems} items!
      </>
    );
  } else {
    // userMode
    const pantryname = (
      <Link to={weblink}>
        <Button
          // tag="a"
          // onClick={() => window.open(weblink, "_blank")}
          variant="link"
          // size="sm"
        >
          <em>{rsvn.name}</em>
        </Button>
      </Link>
    );
    message = (
      <>
        {icon} You have {numItems} items reserved at {pantryname}
      </>
    );
  }

  const messageHeader = (
    <Row className="justify-contnet-center" style={messageStyle}>
      <Col xs={10} className="text-left">
        {message}
      </Col>
      <Col xs={2} className="text-right" style={timeElapsedStyle}>
        {formatters.formatTimeElapsed(receivedTime)} ago.
      </Col>
    </Row>
  );

  return messageHeader;
}

/**
 *  Message center overview message and title
 */
function getMessageOverviewAndTitle(
  rsvns,
  pantryName = null,
  adminMode = true
) {
  let numMsgNotApproved = 0;
  let numMsgNotPickedup = 0;

  rsvns.forEach((rsvn) => {
    if (rsvn.approved === 0) {
      numMsgNotApproved++;
      return;
    }
    if (rsvn.picked_up_time === null) {
      numMsgNotPickedup++;
      return;
    }
  });

  if (adminMode) {
    return (
      // admin mode
      <>
        <Row className="justify-content-center mt-4"></Row>
        <Row className="justify-content-center mt-2">
          <h3>Message Center</h3>
        </Row>
        <hr />
        <Row className="justify-content-center mt-4">
          <h6>
            You have {numMsgNotApproved} reservations to be approved or
            cancelled,
          </h6>
        </Row>
        <Row className="justify-content-center">
          <h6>and {numMsgNotPickedup} reservations waiting to be picked up.</h6>
        </Row>
      </>
    );
  } else {
    return (
      // user mode
      <>
        <Row className="justify-content-center mt-4">
          <h3>Message Center</h3>
        </Row>
        <hr />
        <Row className="justify-content-center mt-4">
          <h6>
            You have {numMsgNotApproved} reservations not approved by the
            pantry,
          </h6>
        </Row>
        <Row className="justify-content-center">
          <h6>and {numMsgNotPickedup} reservations awaiting you to pick up.</h6>
        </Row>
      </>
    );
  }
}

/**
 * Set visibility of Approved Button
 */
function approvedButtonIsHidden(rsvn) {
  // if rsvn is cancelled, approved button should not be up
  if (rsvn.cancelled) return true;
  // if rsvn is approved, approved button should not be up
  else if (rsvn.approved) return true;
  // if rsvn is picked up, approved button should not be up
  else if (rsvn.picked_up_time) return true;
  else return false;
}

/**
 * Set visibility of Picked-Up Button
 */
function pickedupButtonIsHidden(rsvn) {
  // if rsvn is cancelled, pickedup button should not be up
  if (rsvn.cancelled) return true;
  // if rsvn is not approved, pickedup button should not be up
  else if (!rsvn.approved) return true;
  // if rsvn is picked up, pickedup button should not be up
  else if (rsvn.picked_up_time) return true;
  else return false;
}

/**
 * Set visibility of Cancel Button
 */
function cancelButtonIsHidden(rsvn) {
  // if rsvn is cancelled, cancelled button should not be up
  if (rsvn.cancelled) return true;
  // if rsvn is picked up, cancelled button should not be up
  if (rsvn.picked_up_time) return true;
  else return false;
}

/**
 * Set visibility of Reset Button
 */
function resetButtonIsHidden(rsvn) {
  // if rsvn is approved and picked up, reset button should not be up
  if (rsvn.approved && rsvn.picked_up_time) return true;
  if (!rsvn.cancelled) return true;
  // if rsvn ordered time is mroe than 10 days ago, reset button should not be up
  if (formatters.getTimeElapsed(rsvn.order_time, "days") > 10) return true;
  else return false;
}

/**
 * Set visibility of Estimate Pickup Time Button
 */
function editEstButtonIsHidden(rsvn) {
  // if rsvn is cancelled or picked up (complete), buttons should not be up
  if (rsvn.cancelled || rsvn.picked_up_time) return true;
  else return false;
}

// TODO: added bold text for changed estimated pickup time
/**
 * return formatted reservation status.
 */
function getMessageStatus(rsvn) {
  return [
    {
      key: "ID:",
      value: `#${rsvn.reservation_id}`, // append a # in the front of id number
      bgColor: "#FFFFFF",
    },
    {
      key: "ORDERED AT:",
      value: formatters.datetime(rsvn.order_time),
      bgColor: "#F7F7F7",
    },
    {
      key: "APPROVED:",
      value: rsvn.approved ? <strong>approved</strong> : "not approved",
      bgColor: "#FFFFFF",
    },
    {
      key: "ESTIMATED PICK UP AT:",
      value: formatters.datetime(rsvn.estimated_pick_up),
      bgColor: "#F7F7F7",
    },
    {
      key: "PICKED UP AT:",
      value: rsvn.picked_up_time ? (
        <strong>{formatters.datetime(rsvn.picked_up_time)}</strong>
      ) : (
        "not picked up"
      ),
      bgColor: "#FFFFFF",
    },
    {
      key: "CANCELLED:",
      value: rsvn.cancelled ? <strong>cancelled</strong> : "not cancelled",
      bgColor: "#F7F7F7",
    },
  ].map((entry, key) => (
    <Row
      key={key}
      style={{ backgroundColor: entry.bgColor, paddingTop: "3px" }}
    >
      <Col style={keyStyle}>{entry.key}</Col>
      <Col style={valStyle}>{entry.value}</Col>
    </Row>
  ));
}

/**
 * Mark a reservation as approved
 *
 * @param {*} rsvn_id - reservation id to be approved
 * @param {*} pantry_id - pantry id where the reservation id is
 * @param {*} fetchPantryDetail - function to fetch pantry detail to update page
 */
function markAsApproved(rsvn_id, pantry_id, fetchPantryDetail) {
  console.log(rsvn_id);

  PantryService.setApproved(pantry_id, rsvn_id)
    .then(() => {
      fetchPantryDetail(); // push changes to be displayed by re-rendered
      toast.success(
        "You have successfully approved the reservation #" + rsvn_id
      );
    })
    .catch(() => {
      toast.error("Error while approving reservation #" + rsvn_id);
    });
}

/**
 * Mark a reservation as picked up
 *
 * @param {*} rsvn_id - reservation id to be marked as picked up
 * @param {*} pantry_id - pantry id where the reservation id is
 * @param {*} fetchPantryDetail - function to fetch pantry detail to update page
 */
function markAsPickedUp(rsvn_id, pantry_id, fetchPantryDetail) {
  console.log(rsvn_id);
  PantryService.setPickedUp(pantry_id, rsvn_id)
    .then(() => {
      fetchPantryDetail(); // push changes to be displayed by re-rendered
      toast.success(
        "reservation #" + rsvn_id + " was successfully marked as picked up!"
      );
    })
    .catch(() => {
      toast.error(
        "Error while marking reservation #" + rsvn_id + " as picked up."
      );
    });
}

/**
 *  Mark a reservation as cancelled
 *
 * @param {*} rsvn_id - reservation id to be cancelled
 * @param {*} pantry_id - pantry id where the reservation id is
 * @param {*} fetchPantryDetail - function to fetch pantry detail to update page
 */
function markAsCancelled(rsvn_id, pantry_id, fetchPantryDetail) {
  console.log(rsvn_id);
  PantryService.setCancelled(pantry_id, rsvn_id)
    .then(() => {
      fetchPantryDetail(); // push changes to be displayed by re-rendered
      toast.success(
        "You have successfully cancelled the reservation #" + rsvn_id
      );
    })
    .catch(() => {
      toast.error("Error while cancelling reservation #" + rsvn_id);
    });
}

/**
 * Update estimated pickup time to server and prompt message accordingly
 *
 * @param {*} rsvn_id - reservation id that is to be updated
 * @param {*} updTime - the updated estimated pickup time
 * @param {*} pantry_id - pantry id where the reservation id is
 * @param {*} fetchPantryDetail - function to fetch pantry detail to update page
 */
function setEstPickupTime(rsvn_id, updTime, pantry_id, fetchPantryDetail) {
  console.log("3. ", pantry_id);
  console.log("3. ", rsvn_id);
  console.log("3. ", updTime);
  PantryService.updateEstPickupTime(pantry_id, rsvn_id, {
    estimated_pick_up: updTime,
  })
    .then(() => {
      fetchPantryDetail(); // push changes to be displayed by re-rendered
      toast.success(
        "You have successfully updated the estimated pick up time for reservation #" +
          rsvn_id
      );
    })
    .catch(() => {
      toast.error(
        "Error while updating pick up time for reservation #" + rsvn_id
      );
    });
}

/**
 *  Mark a reservation as cancelled
 *
 * @param {*} rsvn_id
 * @param {*} pantry_id - pantry id where the reservation id is
 * @param {*} fetchResponse - function to fetch user reservation detail to update page
 */
function markWithDraw(rsvn_id, pantry_id, fetchResponse) {
  console.log(rsvn_id);
  PantryService.setCancelled(pantry_id, rsvn_id)
    .then(() => {
      fetchResponse(); // push changes to be displayed by re-rendered
      toast.success(
        "You have successfully withdrawed your reservation with ID " + rsvn_id
      );
    })
    .catch(() => {
      toast.error(
        "Error while withdrawing your reservation with ID " + rsvn_id
      );
    });
}

const msgFunctions = {
  // for both user and admin
  getMessageHeader: getMessageHeader,
  getMessageOverviewAndTitle: getMessageOverviewAndTitle,
  cancelButtonIsHidden: cancelButtonIsHidden,
  getMessageStatus: getMessageStatus,

  // for admin
  approvedButtonIsHidden: approvedButtonIsHidden,
  pickedupButtonIsHidden: pickedupButtonIsHidden,
  resetButtonIsHidden: resetButtonIsHidden,
  editEstButtonIsHidden: editEstButtonIsHidden,
  markAsApproved: markAsApproved,
  markAsPickedUp: markAsPickedUp,
  markAsCancelled: markAsCancelled,
  setEstPickupTime: setEstPickupTime,

  // for user
  markWithDraw: markWithDraw,
};

export default msgFunctions;
