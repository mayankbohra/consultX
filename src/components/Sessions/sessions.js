'use client'

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';
import { ethers } from "ethers";

import SessionFactory from '../../../artifacts/contracts/Session.sol/SessionFactory.json';

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
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider2 = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider2.getSigner();
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const account = provider2.getSigner();
      const Address = await account.getAddress();
      // console.log(Address);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        SessionFactory.abi,
        provider
      );

      const getSession = contract.filters.SessionEvent();
      const AllSession = await contract.queryFilter(getSession);

      console.log(AllSession);

      // console.log('Contract instantiated');
      // const userSessions = await contract.returnSessions(Address);
      // console.log(userSessions);
      // await userSessions.wait();
      // const SessionInfo = await getEventsFromTransactionHash(userSessions.hash);
      // console.log(SessionInfo);
      // let SerializerEvent = [];
      // for(let i =0; i<SessionInfo.length; i++) {
      //   let Sessionid = parseInt(SessionInfo[i].args[0]._hex, 16);
      //   let Timing = parseInt(SessionInfo[i].args[5]._hex, 16);
      //   let Amount = parseInt(SessionInfo[i].args[4]._hex, 16);
      //   SerializerEvent[i] = [Sessionid, Timing, Amount]; 
      // }
      // console.log(SerializerEvent);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  async function getEventsFromTransactionHash(transactionHash) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
      if (!transactionReceipt) {
        console.log(transactionHash)
        console.log("Transaction receipt not found.");
        return;
      }
  
      const contractInterface = new ethers.utils.Interface(SessionFactory.abi);
      console.log(transactionReceipt);
      let events = [];
      for(let i = 0; i<transactionReceipt.logs.length-1; i++) {
        events[i] = contractInterface.parseLog(transactionReceipt.logs[i]);
      }
      return events;
    } catch (error) {
      console.error("Error getting transaction receipt:", error.message);
    }
  }

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
