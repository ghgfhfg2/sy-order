import React, { useState, useEffect } from "react";

const Timer = ({ mm, ss, onTimeOut }) => {
  const [minutes, setMinutes] = useState(parseInt(mm));
  const [seconds, setSeconds] = useState(parseInt(ss));

  useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1);
      }
      if (parseInt(minutes) <= 0 && parseInt(seconds) <= 1) {
        setMinutes(0);
        setSeconds(0);
        onTimeOut();
      }
      if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
            clearInterval(countdown);            
        } else {
          setMinutes(parseInt(minutes) - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  return (
    <>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </>
  );
};

export default Timer;