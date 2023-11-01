import React from 'react';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const cardStyle = {
    display: 'flex', // Display content horizontally
    flexDirection: 'row', // Display content in a row
    alignItems: 'center',
    justifyContent: 'center',
    margin: '60px',
};

const headingStyle = {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 16,
};

const textStyle = {
  fontSize: 16,
  marginLeft: 16, // Add some spacing between elements
};

export default function Session() {
  return (
    <div style={containerStyle}>
      <Card sx={cardStyle}>
      <Card sx={cardStyle}>
        <CardContent>
          <Typography variant="h5" sx={headingStyle}>
            Session Details
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={textStyle}>
            Session ID: 12345
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={textStyle}>
            Session Time: 10:00 AM - 11:00 AM
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={textStyle}>
            Session Amount: $10.00
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={textStyle}>
            Session Tutor: John Doe
          </Typography>
        </CardContent>
        <CardActions>
          <Link href="/session-details">View Details</Link>
        </CardActions>
      </Card>
      <Card sx={cardStyle}>
        <CardContent>
          <Typography variant="h5" sx={headingStyle}>
            Session Details
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={textStyle}>
            Session ID: 12345
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={textStyle}>
            Session Time: 10:00 AM - 11:00 AM
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={textStyle}>
            Session Amount: $10.00
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={textStyle}>
            Session Tutor: John Doe
          </Typography>
        </CardContent>
        <CardActions>
          <Link href="/session-details">View Details</Link>
        </CardActions>
      </Card>
      </Card>
    </div>
  );
}
