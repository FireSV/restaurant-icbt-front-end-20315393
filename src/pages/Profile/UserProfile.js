import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Button, CardActionArea, CardActions } from "@mui/material";
import Header from "../../components/common/Header";
import Avatar from "@mui/material/Avatar";
import profile from "../../assets/images/profile.jpg";
import { useSelector } from "react-redux";
import Footer from "../Footer/Footer";

export default function UserProfile() {
  const authState = useSelector((state) => state.auth);
  console.log("authState", authState);
  return (
    <React.Fragment>
      <Header />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            maxWidth: 1000,
            mt: 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardActionArea>
            <CardContent>
              <Avatar
                sx={{ width: 150, height: 150, margin: "0 auto" }}
                src={profile}
                alt="User Avatar"
              />
              <Box sx={{ width: 500, mt: 2 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  {authState.user.firstName === null
                    ? "-"
                    : authState.user.firstName}
                  <span style={{ margin: "0 0.5rem" }}></span>{" "}
                  {authState.user.lastName === null
                    ? "-"
                    : authState.user.lastName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Username: {authState.user.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {authState.user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {authState.user.address}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                    Birthday:{" "}
                    {authState.user.birthday
                      ? authState.user.birthday.substring(0, 10)
                      : "-"}
                  </Typography> */}

                <Typography variant="body2" color="text.secondary">
                  Nic: {authState.user.NIC == null ? "-" : authState.user.NIC}
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Button size="small" color="primary">
              Thank You...!!!
            </Button>
          </CardActions>
        </Card>
      </Box>
      <Box sx={{ mb: 2, mt: 4 }}>
        <Footer />
      </Box>
    </React.Fragment>
  );
}
