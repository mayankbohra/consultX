'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { CardHeader } from '@mui/material';
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SessionFactory from '../../../artifacts/contracts/Session.sol/SessionFactory.json';

export default function Timer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intervalRef = useRef(null);

  const [address, setAddress] = useState(searchParams.get('address'));
  const [tutor, setTutor] = useState(searchParams.get('tutor'));
  const [duration, setDuration] = useState(searchParams.get('time'));
  const [seconds, setSeconds] = useState(searchParams.get('time'));
  const [amount, setAmount] = useState(searchParams.get('amount'));
  const [transactionid, setTransaction] = useState(searchParams.get('transaction'));
  const [query, setQuery] = useState(searchParams.get('query'));
  const [file, setFile] = useState(searchParams.get('file'));

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(intervalRef.current);
        toast.loading("Paying to the Tutor");
        payForSession();
      }
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [seconds]);

  const payForSession = async (paymentAmount) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      if (!provider) {
        toast.warning('MetaMask not connected');
      }

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        tutor,
        SessionFactory.abi,
        signer
      );
      let sessionCount = await getEventsFromTransactionHash(transactionid);

      const paymentTransaction = await contract.makePayment(sessionCount, {
        value: paymentAmount,
      });

      await paymentTransaction.wait();
      setPaymentCompleted(true);

    } catch (error) {
      setPaymentCompleted(false);
      toast.dismiss();
      toast.warning("Please for the Session");
      console.error('Error creating session:', error);
    }
  };

  async function getEventsFromTransactionHash(transactionHash) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
      if (!transactionReceipt) {
        console.log("Transaction receipt not found.");
        return;
      }

      const contractInterface = new ethers.utils.Interface(SessionFactory.abi);
      const events = contractInterface.parseLog(transactionReceipt.logs[0]);
      const decimalValue = parseInt(events.args[0]._hex, 16);
      return decimalValue;
    } catch (error) {
      console.error("Error getting transaction receipt:", error.message);
    }
  }

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const remainingSeconds = time % 60;

    const padZero = (value) => (value < 10 ? `0${value}` : value);

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
  };

  const handleEndSession = async () => {
    const shouldEndSession = window.confirm("Are you sure you want to end the session?");
    if (shouldEndSession) {
      const requiredAmount = (((duration - seconds) / 60) * 0.012).toFixed(3);
      const parsedAmount = ethers.utils.parseEther(requiredAmount.toString()).toString();

      setAmount(parsedAmount);
      clearInterval(intervalRef.current);

      toast.loading("Paying to the Tutor");
      await payForSession(parsedAmount);
    }
  };

  useEffect(() => {
    if (paymentCompleted) {
      toast.dismiss();
      toast.success("Payment successfull");
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [paymentCompleted, router]);

  const handleOpenFile = () => {
    const fileLink = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}.mypinata.cloud/ipfs/${file}`;

    window.open(fileLink, '_blank');
  }

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80%' }}>
          <div style={{ width: '100%', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Card sx={{ padding: '20px', backgroundColor: '#333', color: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '45%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: '#2196f3' }}>
                  Sessions Details
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span style={{ fontWeight: 'bold', color: '#FF9800' }}>Duration: </span>
                  {duration / 60} {duration > 60 ? 'minutes' : 'minute'}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span style={{ fontWeight: 'bold', color: '#FF9800' }}>Query: </span>
                  {query}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span style={{ fontWeight: 'bold', color: '#FF9800' }}>Total Amount to pay: </span>
                  {ethers.utils.formatEther(amount)} Matic
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#1976D2', color: '#FFF', marginTop: 2 }}
                  onClick={handleOpenFile}
                >
                  View File
                </Button>
              </CardContent>
            </Card>
            <div style={{ width: '45%' }}>
              <Card sx={{ padding: '20px', backgroundColor: '#333', color: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <CardContent style={{ textAlign: 'center' }}>
                  <FontAwesomeIcon icon={faClock} style={{ fontSize: '48px', color: '#1976D2' }} />
                  <Typography variant="h6" gutterBottom style={{ marginTop: '10px', color: '#FFF' }}>
                    {formatTime(seconds)}
                  </Typography>
                </CardContent>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: '#FF9800', color: '#FFF' }}
                    onClick={handleEndSession}
                  >
                    End Session
                  </Button>
                </Box>
              </Card>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </main>
  );
}
