// reference: https://stackoverflow.com/questions/62279951/scroll-back-to-top-button-not-working-in-react-js
import React from "react";
import Button from "react-bootstrap/Button";

const ScrollToTop = (props) => {
  const [intervalId, setIntervalId] = React.useState(0);
  const [thePosition, setThePosition] = React.useState(false);

  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 170) {
        setThePosition(true);
      } else {
        setThePosition(false);
      }
    });
    // window.scrollTo(0, 0);
  }, []);

  const onScrollStep = () => {
    if (window.pageYOffset === 0) {
      clearInterval(timeoutRef.current);
    }
    window.scroll(0, window.pageYOffset - props.scrollStepInPx);
  };

  const scrollToTop = () => {
    timeoutRef.current = setInterval(onScrollStep, props.delayInMs);
  };

  const renderGoTopIcon = () => {
    return (
      <Button
        className={`go-top ${thePosition ? "active" : ""}`}
        variant="outline-dark"
        size="sm"
        onClick={scrollToTop}
      >
        Scroll to Top
      </Button>
    );
  };

  return <>{renderGoTopIcon()}</>;
};

export default ScrollToTop;
