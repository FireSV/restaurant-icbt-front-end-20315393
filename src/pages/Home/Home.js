import "./Public.home.css";
import logo from "../../assets/images/logo.png";
import logo1 from "../../assets/images/logo1.png";
import Footer from "../Footer/Footer";
import Testamonial from "../Testamonial/Testamonial";
import InquaryCard from "../InquaryCard/InquaryCard";
import MainCard from "../../components/MainCard/MainCard1";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import MainCard1 from "../../components/MainCard/MainCard1";
import MainCard2 from "../../components/MainCard/MainCard2";
import MainCard3 from "../../components/MainCard/MainCard3";
import MainCard4 from "../../components/MainCard/MainCard4";
import { NavLink } from "react-router-dom";
import NavBar from "../../components/common/NavBar";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Home = () => {
  return (
    <div>
      <section className="header">
        <nav className="navbar navbar-expand ">
          <a href="/" className="navbar-brand ms-1">
            <img src={logo1} className="app" alt="logo1" />
          </a>
          <NavBar />
        </nav>

        <div className="text-box">
          <h1>Healthy Food</h1>
          <h3>
            Healthy Food - Nourish Your Body, Fuel Your Life
            <br />
          </h3>
        </div>
      </section>

      {/* Main Header */}
      <section className="testimonoals">
        <h1 className="bodyheader">
          Deliciously - Your Ultimate Food Companion
        </h1>
        <p className="bodyheader">
          Discover, order, and enjoy your favorite meals with Deliciously, the
          ultimate food companion app. Whether you're craving a quick snack, a
          hearty meal, or exploring new cuisines, Deliciously has you covered.
          Our app connects you with a wide range of local restaurants, food
          trucks, and home chefs, bringing a world of flavors right to your
          doorstep.{" "}
        </p>
        <Testamonial />
      </section>
      <br></br>
      <section className="testimonoals">
        <h1 className="bodyheader">
          Deliciously - Your Culinary Adventure Awaits
        </h1>
        <p className="bodyheader">
          Embark on a gastronomic journey with Deliciously, the go-to app for
          food lovers everywhere. From street food gems to gourmet dining,
          Deliciously opens the door to a vast array of culinary delights.
          Whether you’re planning a cozy night in or hosting a feast with
          friends, our app makes it easier than ever to discover new dishes,
          savor your favorites, and support local food artisans.
        </p>

        <Box sx={{ width: "100%", mt: 5 }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={3}>
              <MainCard1 />
            </Grid>
            <Grid item xs={3}>
              <MainCard2 />
            </Grid>
            <Grid item xs={3}>
              <MainCard3 />
            </Grid>
            <Grid item xs={3}>
              <MainCard4 />
            </Grid>
          </Grid>
        </Box>
      </section>
      <section className="cta" sx={{ width: "80%" }}>
        <h1>
          "Let Every Meal Be a Delightful Journey"
          <br />
          We are Deliciously, Your Culinary Guide
        </h1>
      </section>
      <Footer />
    </div>
  );
};
export { Home };
