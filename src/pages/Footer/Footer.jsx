import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div>
      <div>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
        />
        <footer className="footer">
          <div className="container">
            <div className="rowfooter">
              <div className="footer-col">
                <h4>Healthy Food</h4>
                <ul>
                  <li>
                    <Link to="/about">about us</Link>
                  </li>
                  <li>
                    <Link to="/about">our services</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Branches</h4>
                <ul>
                  <li>
                    <Link to="/about">Head Office</Link>
                  </li>
                  <li>
                    <Link to="/about">Super Branch</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Food Recipes</h4>
                <ul>
                  <li>
                    <Link to="/">Easy Ordering</Link>
                  </li>
                  <li>
                    <Link to="/">Real-time Tracking</Link>
                  </li>
                  <li>
                    <Link to="/">Exclusive Deals</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>follow us</h4>
                <div className="social-links">
                  <Link to="/">
                    <i className="fab fa-facebook-f" />
                  </Link>
                  <Link to="/">
                    <i className="fab fa-twitter" />
                  </Link>
                  <Link to="/">
                    <i className="fab fa-instagram" />
                  </Link>
                  <Link to="/">
                    <i className="fab fa-linkedin-in" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
