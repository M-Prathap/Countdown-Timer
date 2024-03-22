import React from "react";
import "../Style/main.css";

const main = ({ time, date }) => {
  return (
    <div className="Display">
      <div>
        <h1>{time}</h1>
        <p>{date}</p>
      </div>
    </div>
  );
};

export default main;
