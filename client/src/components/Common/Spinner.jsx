import React from "react";

function Spinner() {
  return (

      <div
        className=" bg-white  position-fixed w-100 h-100"
        style={{ zIndex: "9999999" }}
      >
        <div className="new_prelader"></div>
      </div>

  );
}

export default Spinner;
