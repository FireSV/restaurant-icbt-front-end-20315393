import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import user2 from "../../assets/images/user2.jpg";

export default function MediaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 200 }} image={user2} title="green iguana" />
      <CardContent sx={{ height: 150, overflow: "hidden" }}>
        <Typography gutterBottom variant="h5" component="div">
          User Reviews & Ratings
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Make informed decisions with honest reviews and ratings from fellow
          foodies.
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Share</Button>
        <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
