import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap', // Allow cards to wrap to the next row
};

const cardStyle = {
  flexDirection: 'row',
  margin: '10px',
  backgroundColor: '#f0f0f0', // Background color for the first Card
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', // Shadow for the first Card
  border: '1px solid #ccc', // Border for the first Card
};

const cardStyle2 = {
  display: 'flex', // Display content horizontally
  margin: '10px',
  backgroundColor: '#e0e0e0', // Background color for the second Card
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', // Shadow for the second Card
  border: '1px solid #bbb', // Border for the second Card
};

const headingStyle = {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 16,
};

const textStyle = {
  fontSize: 16,
  marginLeft: 16, // Add some spacing between elements
  display: 'inline', // Display Typography elements horizontally
};

export default function Session() {
  return (
    <div style={containerStyle}>
      <Card sx={cardStyle}>
        <CardHeader title="Sessions" />
        <Card sx={cardStyle2}>
          <CardContent>
            <Typography variant="h6" sx={textStyle}>
              Session #35234
            </Typography>
            <Typography variant="h6" sx={textStyle}>
              Timing: 10:00 AM - 11:00 AM
            </Typography>
            <Typography variant="h6" sx={textStyle}>
              Date: 12/10/2021
            </Typography>
          </CardContent>
        </Card>
        <Card sx={cardStyle2}>
          <CardContent>
            <Typography variant="h6" sx={textStyle}>
              Session #35234
            </Typography>
            <Typography variant="h6" sx={textStyle}>
              Timing: 10:00 AM - 11:00 AM
            </Typography>
            <Typography variant="h6" sx={textStyle}>
              Date: 12/10/2021
            </Typography>
          </CardContent>
        </Card>
        <Card sx={cardStyle2}>
          <CardContent>
            <Typography variant="h6" sx={textStyle}>
              Session #35234
            </Typography>
            <Typography variant="h6" sx={textStyle}>
              Timing: 10:00 AM - 11:00 AM
            </Typography>
            <Typography variant="h6" sx={textStyle}>
              Date: 12/10/2021
            </Typography>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}
