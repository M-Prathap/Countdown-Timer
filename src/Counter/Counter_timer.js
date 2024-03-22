import React, { useState, useEffect, useCallback } from "react";
import ShowTimer from "./main";
import "../Style/Counter_timer.css";

const Counter_timer = () => {
  const [targetDateTime, setTargetDateTime] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [countdownOver, setCountdownOver] = useState(false);
  const [timerState, setTimerState] = useState("stopped");

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    setTargetDateTime(getCurrentDateTime());
  }, []);

  const startTimer = useCallback(() => {
    const targetTime = new Date(targetDateTime).getTime();
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference > 0) {
      setRemainingTime(difference);
      setTimerState("started");

      const id = setInterval(() => {
        const currentTime = new Date().getTime();
        const newDifference = targetTime - currentTime;

        if (newDifference <= 0) {
          clearInterval(id);
          setRemainingTime(0);
          setCountdownOver(true);
          setTimerState("stopped");
        } else {
          setRemainingTime(newDifference);
        }
      }, 1000);

      setTimerId(id);
    } else {
      setCountdownOver(true);
    }
  }, [targetDateTime]);

  const stopTimer = useCallback(() => {
    clearInterval(timerId);
    setTimerId(false);
    setTimerState("stopped");
  }, [timerId]);

  const resetTimer = () => {
    clearInterval(timerId);
    setTimerId(null);
    setTargetDateTime("");
    setRemainingTime(0);
    setCountdownOver(false);
    setTimerState("reset");
  };

  const handleDateTimeChange = (event) => {
    const { value } = event.target;

    const maxDaysFromNow = 99;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDaysFromNow);

    const selectedDate = new Date(value);
    if (selectedDate > maxDate) {
      alert(`Please select a date within ${maxDaysFromNow} days from now.`);
      return;
    }
    setTargetDateTime(value);
    setTimerState("stopped");
  };

  useEffect(() => {
    if (timerId !== null && timerState === "started") {
      clearInterval(timerId);
      startTimer();
    }
  }, [targetDateTime, startTimer, timerId, timerState]);

  useEffect(() => {
    return () => {
      if (timerId !== null) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  return (
    <div className="container">
      <h1 className="heading">
        Countdown <span className="heading_1">Timer</span>
      </h1>
      <div className="input">
        <input
          type="datetime-local"
          value={targetDateTime}
          onChange={handleDateTimeChange}
        />
        <div>
          {timerState === "stopped" ? (
            <button onClick={startTimer}>Start Timer</button>
          ) : (
            <>
              <button onClick={stopTimer}>Stop Timer</button>
              <button onClick={resetTimer}>Reset Timer</button>
            </>
          )}
        </div>
      </div>
      <div className="container_1">
        {countdownOver ? (
          <p>🎉The countdown is over. What's next on your adventure? 🎉</p>
        ) : (
          <>
            <div>
              <ShowTimer
                time={Math.floor(remainingTime / (1000 * 60 * 60 * 24))}
                date={"Days"}
              />
            </div>
            <div>
              <ShowTimer
                time={Math.floor(
                  (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                )}
                date={"Hours"}
              />
            </div>
            <div>
              <ShowTimer
                time={Math.floor(
                  (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
                )}
                date={"Minutes"}
              />
            </div>
            <div>
              <ShowTimer
                time={Math.floor((remainingTime % (1000 * 60)) / 1000)}
                date={"Seconds"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Counter_timer;
