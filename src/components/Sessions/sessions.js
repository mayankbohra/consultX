'use client'

import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, CardHeader, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ethers } from "ethers";

import SessionFactory from '../../../artifacts/contracts/Session.sol/SessionFactory.json';

export default function session() {
  const [sessions, setSessions] = useState([]);

  const [tutor, setTutor] = useState();
  const [query, setQuery] = useState();
  const [duration, setDuration] = useState();
  const [amount, setAmount] = useState();
  const [fileURI, setFileURI] = useState();

  const CustomButton = styled(Button)(({ theme }) => ({
    marginTop: '10px',
    color: '#fff',
    borderColor: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }));

  const handleFetchData = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const provider2 = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
      const account = provider.getSigner();
      const Address = await account.getAddress();

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        SessionFactory.abi,
        provider2
      );

      const getSession = contract.filters.SessionEvent(null, Address, null, null, null, null, null);
      const AllSession = await contract.queryFilter(getSession);
      const Data = AllSession.map((e) => {
        return {
          tutorAddress: e.args.tutor,
          query: e.args.query,
        
          duration: ethers.BigNumber.from(e.args.duration).toNumber(),
          amount: ethers.utils.formatUnits(ethers.BigNumber.from(e.args.amount)),
          fileURI: e.args.fileURI
        }
      })

      setSessions(Data);
      console.log(Data);

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
      for (let i = 0; i < transactionReceipt.logs.length - 1; i++) {
        events[i] = contractInterface.parseLog(transactionReceipt.logs[i]);
      }

      return events;
    } catch (error) {
      console.error("Error getting transaction receipt:", error.message);
    }
  };

  const getTutorName = (tutorAddress) => {
    if (tutorAddress === '0x0C2a1797D2EC0a0Cbcc7b611382F8e1E58fA6091') return 'Tutor 1';
    if (tutorAddress === '0x5c96e646905EE5446a727E588542C4a273D8c8a9') return 'Tutor 2';
    return 'Unknown Tutor';
  };

  const openFileURI = (fileURI) => {
    window.open(`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}.mypinata.cloud/ipfs/${fileURI}`, '_blank');
  };

  useEffect(() => {
    handleFetchData(); 
  }, []);

  return (
    <>
      <div style={{ padding: '50px' }}>
        {sessions.length === 0 ? (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
          >
            <Typography variant="h4">No Past Sessions</Typography>
          </Grid>
        ) : (
          <Grid container spacing={2} justifyContent="center" sx={{ rowGap: 2, columnGap: 2 }}>
            {sessions.map((session, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={3}>
                <Card sx={{ padding: '20px', backgroundColor: '#333', color: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <CardHeader
                    title="Session"
                    sx={{ color: '#2196f3' }}
                  />
                  <CardContent>
                    <Typography variant="h6">
                      <span style={{ fontWeight: 'bold', color: '#FF9800' }}>Tutor: </span>
                      {getTutorName(session.tutorAddress)}
                    </Typography>
                    <Typography variant="h6">
                      <span style={{ fontWeight: 'bold', color: '#FF9800' }}>Duration: </span>{' '}
                      {session.duration} {session.duration > 1 ? 'minutes' : 'minute'}
                    </Typography>
                    <Typography variant="h6">
                      <span style={{ fontWeight: 'bold', color: '#FF9800' }}>Amount: </span>
                      {session.amount} Matic
                    </Typography>
                    {session.fileURI && (
                      <CustomButton
                        variant="outlined"
                        onClick={() => openFileURI(session.fileURI)}
                      >
                        View File
                      </CustomButton>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </>
  );
};
