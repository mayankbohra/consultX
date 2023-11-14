'use client'
import React, { useState, useEffect } from 'react';
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

  const [address, setAddress] = useState(searchParams.get('address'));
  const [tutor, setTutor] = useState(searchParams.get('tutor'));
  const [seconds, setSeconds] = useState(searchParams.get('time'));
  const [amount, setAmount] = useState(searchParams.get('amount'));
  const [query, setQuery] = useState(searchParams.get('query'));
  const [file, setFile] = useState(searchParams.get('file'));

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(interval);
        console.log(address);

        payForSession().then(() => {
          setPaymentCompleted(true);
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  useEffect(() => {
    if (paymentCompleted) {
      router.push('/');
    }
  }, [paymentCompleted, router]);

  const payForSession = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        tutor,
        Session.abi,
        signer
      );

      const paymentTransaction = await contract.makePayment({
        value: amount,
      });
      await paymentTransaction.wait();

      setPaymentCompleted(true);
    } catch (error) {
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

  const handleEndSession = () => {
    const shouldEndSession = window.confirm("Are you sure you want to end the session?");
    if (shouldEndSession) {
      toast.success("Session ended");
      router.push(`/`);
    }
  }

  return (
    <main>
      <Navbar sessionInProgress={true} />
      <div style={cardContainerStyle}>
        <Card sx={cardstyle}>
          <CardHeader title="Sessions Details" />
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
