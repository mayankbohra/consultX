'use client'
import React, { useState, useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { CardHeader } from '@mui/material';
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Session from '../../../artifacts/contracts/Session.sol/Session.json';

const cardContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  // margin: '1rem 5rem',
  justifyContent: 'space-between',
};

const cardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  minHeight: '50vh',
  margin: '30px',
};

const timeStyle = {
  fontSize: '24px',
};

const headingStyle = {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 16,
};

const cardstyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '60px',
};

const cardStyle2 = {
  display: 'flex',
  
  margin: '10px',
  backgroundColor: '#e0e0e0',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
  border: '1px solid #bbb',
};

const textStyle = {
  fontSize: 16,
  marginLeft: 16,
  display: 'inline',
};

export default function Timer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intervalRef = useRef(null);

  const [address, setAddress] = useState(searchParams.get('address'));
  const [tutor, setTutor] = useState(searchParams.get('tutor'));
  const [duration, setDuration] = useState(searchParams.get('time'));
  const [seconds, setSeconds] = useState(searchParams.get('time'));
  const [amount, setAmount] = useState(searchParams.get('amount'));
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
        Session.abi,
        signer
      );

      console.log(paymentAmount);

      const paymentTransaction = await contract.makePayment({
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
      }, 5000);
    }
  }, [paymentCompleted, router]);

  const handleOpenFile = () => {
    const fileLink = `https://purple-hilarious-wasp-600.mypinata.cloud/ipfs/${file}`;

    window.open(fileLink, '_blank');
  }

  return (
    <main>
      <Navbar sessionInProgress={true} />
      <div style={cardContainerStyle}>
        <Card sx={cardstyle}>
          <CardHeader title="Sessions Details" />
          <Card sx={cardStyle2}>
            <CardContent style={{ display: 'flex', flexDirection: 'column', alignItem: 'center' }}>
              <Typography variant="h6" sx={textStyle}>
                Duration: {duration/60} minutes
              </Typography>
              <Typography variant="h6" sx={textStyle}>
                Query: {query}
              </Typography>
              <Typography variant="h6" sx={textStyle}>
                Total Amount to pay: {ethers.utils.formatEther(amount)} Matic
              </Typography>
              <button className='bg-blue-500 text-white py-2 px-4 rounded cursor-pointer' variant='contained' onClick={handleOpenFile}>
                View File
              </button>
            </CardContent>
          </Card>
        </Card>
        <div style={cardStyle}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <FontAwesomeIcon icon={faClock} style={timeStyle} /> {formatTime(seconds)}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleEndSession}>End Session</Button>
            </CardActions>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
