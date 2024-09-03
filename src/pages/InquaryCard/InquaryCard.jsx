import React from "react";
import "./InquaryCard.css";
import personal from "../../assets/images/personal.jpg";
import bas from "../../assets/images/bas.jpg";
import company from "../../assets/images/company.jpg";
import Swal from "sweetalert2";

export default function InquaryCard() {
  const file = () => {};

  return (
    <div>
      <section id="facilities">
        <div className="container">
          <div className="title">
            <h1>Customer Taxations Documents.</h1>
            <p>
              Our specialist tax knowledge encompasses both national and global
              laws of taxation. As a result, you would get expert advice.
              Immediately connect with us and Grow your Company or Personal
              Wealth.
            </p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div card text-center>
                <img src={personal} className="card-img-top" alt="personal" />
                <div className="card-body">
                  <h5 card-title>Personal Tax</h5>
                  <p>
                    An income tax is a tax imposed on individuals or entities in
                    respect of the income or profits earned by them. Income tax
                    generally is computed as the product of a tax rate times the
                    taxable income. Taxation rates may vary by type or
                    characteristics of the taxpayer and the type of income.
                  </p>

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => file()}
                  >
                    Inquiry
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div card text-center>
                <img src={bas} className="card-img-top" alt="bas" />
                <div className="card-body">
                  <h5 card-title>BAS</h5>
                  <p>
                    An income tax is a tax imposed on individuals or entities in
                    respect of the income or profits earned by them. Income tax
                    generally is computed as the product of a tax rate times the
                    taxable income. Taxation rates may vary by type or
                    characteristics of the taxpayer and the type of income.
                  </p>
                  <i className="fa fa-file-text-o" aria-hidden="true"></i>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => file()}
                  >
                    Inquiry
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div card text-center>
                <img src={company} className="card-img-top" alt="company" />
                <div className="card-body">
                  <h5 card-title>Company Tax</h5>
                  <p>
                    An income tax is a tax imposed on individuals or entities in
                    respect of the income or profits earned by them. Income tax
                    generally is computed as the product of a tax rate times the
                    taxable income. Taxation rates may vary by type or
                    characteristics of the taxpayer and the type of income.
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => file()}
                  >
                    Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
