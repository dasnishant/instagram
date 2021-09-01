import React from "react";

function CountComponent({ count, text, showModal }) {
  return (
    <span onClick={() => showModal()}>
      {count} <strong>{text}</strong>
    </span>
  );
}

export default CountComponent;
