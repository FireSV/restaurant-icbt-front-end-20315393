import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import user3 from '../../assets/images/user3.jpg';

export default function MainCard4() {
  return (
    <Card sx={{ maxWidth: 345}}>
      <CardActionArea>
           <img src={user3} alt="user3"/>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Donate Resources
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          {/* Share */}
        </Button>
      </CardActions>
    </Card>
  );
}