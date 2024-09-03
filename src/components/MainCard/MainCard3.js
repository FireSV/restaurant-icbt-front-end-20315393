// import * as React from "react";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import { Button, CardActionArea, CardActions } from "@mui/material";
// import user3 from "../../assets/images/user3.jpg";

// export default function MainCard3() {
//   return (
//     <Card sx={{ maxWidth: 360, borderRadius: 3, backgroundColor: "#fafffa" }}>
//       <CardActionArea>
//         <img src={user3} alt="user3" />
//         <CardContent style={{ height: "200px" }}>
//           <Typography gutterBottom variant="h5" component="div">
//             Exclusive Food Content
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Access chef-curated recipes, cooking tips, and food trends to
//             inspire your next meal.
//           </Typography>
//         </CardContent>
//       </CardActionArea>
//       <CardActions>
//         <Button size="small" color="primary">
//           {/* Share */}
//         </Button>
//       </CardActions>
//     </Card>
//   );
// }

import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import user3 from "../../assets/images/user3.jpg";

export default function MediaCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 200 }} image={user3} title="green iguana" />
      <CardContent sx={{ height: 150, overflow: "hidden" }}>
        <Typography gutterBottom variant="h5" component="div">
          Exclusive Food Content
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Access chef-curated recipes, cooking tips, and food trends to inspire
          your next meal.
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Share</Button>
        <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
}
