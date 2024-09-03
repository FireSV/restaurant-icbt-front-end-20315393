import React from "react";
import "./ImageListView.css";
import { Box } from "@mui/material";
import Header from "../../components/common/Header";
import Footer from "../../pages/Footer/Footer";
import Gallery from "../../components/common/Gallery";

const ImageListView = () => {
  return (
    <div className="main-container">
      <Header />
      <div className="content">
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Gallery />
        </Box>
      </div>
      <Footer />
    </div>
  );
};

export default ImageListView;
