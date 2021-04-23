// reference: https:github.com/davidhu2000/react-spinners/issues/53

import Spinner from "react-bootstrap/Spinner";
import React from "react";

const MySpinner = (props) => {
  const style = {
    textAlign: "center",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  return (
    <div style={style}>
      <Spinner animation="grow" />
      <br />
      loading ...
    </div>
  );
};

export default MySpinner;
