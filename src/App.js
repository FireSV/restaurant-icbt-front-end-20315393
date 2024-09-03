import React, { useEffect } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//common
import Sidebar from "./components/common/SideBar";
import NavBar from "./components/common/NavBar";

//view
import Dashboard from "./views/Dashboard";
import Branch from "./views/Branch/Branch";
import Orders from "./views/Orders";
import RatePage from "./views/RatePage";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import { useSelector } from "react-redux";
import PageNotFound from "./views/PageNotFound";
import { Home } from "./pages/Home/Home";
import Recepies from "./views/Recepies/Recepies";
import DonationProfile from "./views/DonationProfile";
import Calendar from "./views/Calendar";
import UserProfile from "./pages/Profile/UserProfile";
import PayButton from "./views/PayButton";
import ImageListView from "./views/ImageListView/ImageListView";

// import MapGoogal from "./views/MapGoogal";

const App = () => {
  const authState = useSelector((state) => state.auth);

  return (
    <React.Fragment>
      <Stack flexDirection="row">
        <Grid container>
          <Grid item xs={12}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/gallery" element={<ImageListView />} />
                <Route path="/branch" element={<Branch />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/recepies" element={<Recepies />} />
                <Route path="/rate/:id" element={<RatePage />} />
                <Route path="/donation/:id" element={<DonationProfile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/payment" element={<PayButton />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
          </Grid>
        </Grid>
      </Stack>
    </React.Fragment>
  );
};

export default App;
