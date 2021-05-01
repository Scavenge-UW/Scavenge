// imports for icons
import { BsQuestionCircle } from "react-icons/bs";

// imports for tooltip
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function getTooltip(type) {
  let renderTooltip = null;
  switch (type) {
    case "description":
      renderTooltip = () => (
        <Tooltip id="description-tooltip">
          <strong>Your pantry description</strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    case "address":
      renderTooltip = () => (
        <Tooltip id="address-tooltip">
          <strong>Address of your pantry (ex. 2201 Darwin Rd)</strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    case "zipcode":
      renderTooltip = () => (
        <Tooltip id="zipcode-tooltip">
          <strong>
            Enter your 5-digit zip code of your pantry (ex. 53699)
          </strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    case "city":
      renderTooltip = () => (
        <Tooltip id="city-tooltip">
          <strong>The city where your pantry reside at (ex. Madison)</strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    case "state":
      renderTooltip = () => (
        <Tooltip id="state-tooltip">
          <strong>
            Abbreviation of the state where your pantry reside in (ex. WI for
            Wisconsin)
          </strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    case "phone":
      renderTooltip = () => (
        <Tooltip id="phone-tooltip">
          <strong>Enter 10-digit phone number (ex. 1234567890)</strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    case "weblink":
      renderTooltip = () => (
        <Tooltip id="weblink-tooltip">
          <strong>
            The website link to your pantry's website (ex.
            https://abc_pantry.com).
          </strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    case "img_src":
      renderTooltip = () => (
        <Tooltip id="img-src-tooltip">
          <strong>The feature is not implemented yet.</strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    case "time_to_add":
      renderTooltip = () => (
        <Tooltip id="time-to-add-tooltip">
          <strong>
            This is automatically added to your customers' order time to be the
            Estimated Pickup Time. (i.e. user order time + time to add =
            estimated order time)
          </strong>
        </Tooltip>
      );
      return (
        <>
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 400 }} // delay for show and hide the tooltip
            overlay={renderTooltip()}
          >
            <BsQuestionCircle size="1.3rem" color="#48AAAD" />
          </OverlayTrigger>
        </>
      );
    default:
      return;
  }
}

const ddtooltip = {
  getTooltip: getTooltip,
};

export default ddtooltip;
