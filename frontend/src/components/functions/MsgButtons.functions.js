// import for bootstrap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// other imports
import formatters from "../formatters/DatetimeFormatter"; // time formatters

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

/*
      TODO: 
      marked complete reservation with check2-circle icon
      marked cancelled reservation with x-circle icon
      - https://icons.getbootstrap.com
  */
/**
 * @returns the message header (title and reservation time) for each message.
 */
function getMessageHeader(rsvn, adminMode, weblink = null) {
  const receivedTime = rsvn.order_time;
  const numItems = (
    <span style={monoStyle}>{Object.keys(rsvn.res_foods).length}</span>
  );
  let message;
  if (adminMode) {
    const username = <span style={monoStyle}>{rsvn.username}</span>;
    message = ["User ", username, " just reserved ", numItems, " items!"];
  } else {
    const pantryname = (
      <Button
        tag="a"
        onClick={() => window.open(weblink, "_blank")}
        variant="link"
        // size="sm"
      >
        <em>{rsvn.name}</em>
      </Button>
    );
    message = ["You have  ", numItems, " items reserved at ", pantryname];
  }

  const messageHeader = (
    <Row className="align-items-center" style={messageStyle}>
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
  // if rsvn is picked up, cancelled button should not be up
  else return false;
}

/*
  TODO: 
  marked complete reservation with check2-circle icon
  marked cancelled reservation with x-circle icon
  add hover over description
  - https://icons.getbootstrap.com
  */

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
      value: rsvn.approved ? "approved" : "not approved",
      bgColor: "#FFFFFF",
    },
    {
      key: "ESTIMATED PICK UP AT:",
      value: formatters.datetime(rsvn.estimated_pick_up),
      bgColor: "#F7F7F7",
    },
    {
      key: "PICKED UP AT:",
      value: rsvn.picked_up_time
        ? formatters.datetime(rsvn.picked_up_time)
        : "not picked up",
      bgColor: "#FFFFFF",
    },
    {
      key: "CANCELLED:",
      value: rsvn.cancelled ? "cancelled" : "not cancelled",
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

const msgFunctions = {
  getMessageHeader: getMessageHeader,
  approvedButtonIsHidden: approvedButtonIsHidden,
  pickedupButtonIsHidden: pickedupButtonIsHidden,
  cancelButtonIsHidden: cancelButtonIsHidden,
  resetButtonIsHidden: resetButtonIsHidden,
  getMessageStatus: getMessageStatus,
};

export default msgFunctions;
