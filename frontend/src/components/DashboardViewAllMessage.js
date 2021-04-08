import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Fade from "react-bootstrap/Fade";

function DashboardMessage(props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-fade-text"
        aria-expanded={open}
      >
        View All Messages
      </Button>
      <Fade in={open}>
        <div id="example-fade-text">
          Non tempor culpa proident mollit eu. Occaecat nostrud laborum nostrud
          tempor nulla est duis deserunt ex enim ut. Sunt cillum ea magna do
          magna est est enim veniam. Reprehenderit commodo aliquip veniam
          laboris esse commodo enim voluptate velit. Adipisicing adipisicing ut
          duis laborum cupidatat nisi sit nostrud. Cupidatat sit nulla aute
          velit dolore exercitation eu id ad officia consequat laboris. Dolore
          velit id laboris ea.
        </div>
      </Fade>
    </>
  );
}

export default DashboardMessage;
