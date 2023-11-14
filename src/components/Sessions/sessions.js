'use client'

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';
import { ethers } from "ethers";

import SessionFactory from '../../../artifacts/contracts/Session.sol/SessionFactory.json';
import Session from '../../../artifacts/contracts/Session.sol/Session.json';

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

export default function session() {
  const handleFetchData = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        SessionFactory.abi,
        provider
      );

      console.log('Contract instantiated');

      const filter = contract.filters.sessionCreated();
      console.log('Filter set up');

      const events = await contract.queryFilter(filter);
      console.log('Events fetched:', events.length);

      const sessions = await Promise.all(
        events.map(async (event) => {
          const sessionAddress = event.args.sessionAddress;
          const sessionContract = new ethers.Contract(sessionAddress, Session.abi, provider);

          const user = await sessionContract.user();
          const tutor = await sessionContract.tutor();
          const query = await sessionContract.query();
          const duration = await sessionContract.duration();
          const amount = ethers.utils.formatEther(await sessionContract.amount());
          const fileURI = await sessionContract.fileURI();

          return {
            address: sessionAddress,
            user,
            tutor,
            query,
            duration,
            amount,
            fileURI,
          };
        })
      );

      sessions.forEach((session) => {
        console.log('Session Address:', session.address);
        console.log('User:', session.user);
        console.log('Tutor:', session.tutor);
        console.log('Query:', session.query);
        console.log('Duration:', session.duration);
        console.log('Amount:', session.amount);
        console.log('File URI:', session.fileURI);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
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
          <div>
            {/* Button to trigger fetching data */}
            <button onClick={handleFetchData}>Fetch Session Data</button>
          </div>
        </Card>
      </div>
    </>
  );
}
