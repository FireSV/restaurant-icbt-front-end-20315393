import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import user4 from "../../assets/images/user4.jpg";
import { Box } from "@mui/material";
import Rate from "../common/Rate";

export default function MediaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 200 }} image={user4} title="green iguana" />
      <CardContent sx={{ height: 100, overflow: "hidden" }}>
        <Typography gutterBottom variant="body2" component="div">
          Your Rate
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Rate />
        </Box>
      </CardContent>
    </Card>
  );
}
