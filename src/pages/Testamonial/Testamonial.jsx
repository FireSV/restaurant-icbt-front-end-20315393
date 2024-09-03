import React from "react";
import people from "../../assets/images/people.png";
import home from "../../assets/images/home.png";
import food from "../../assets/images/food.png";
import "./testamonial.css";

function Testamonial() {
  return (
    <div>
      <div className="wrapper">
        {/* <!---Review Card---> */}
        <div className="cards">
          <div className="card1">
            <img src={home} alt="home" />
          </div>
          <div className="card1">
            <img src={people} alt="people" />
          </div>
          <div className="card1">
            <img src={food} alt="people" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testamonial;
