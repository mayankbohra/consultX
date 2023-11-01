'use client'
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar/Navbar";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  { useRouter } from 'next/navigation';

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
};

const timeStyle = {
  fontSize: '24px',
};


export default function Timer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [seconds, setSeconds] = useState(searchParams.get('time') || 0);

    useEffect(() => {
        const interval = setInterval(() => {
        if (seconds > 0) {
            setSeconds(seconds - 1);
        } else {
            toast.success("Session ended");
            router.push(`/`);
        }
        }, 1000);

        return () => {
        clearInterval(interval);
        };
    }, [seconds]);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const remainingSeconds = time % 60;

        const padZero = (value) => (value < 10 ? `0${value}` : value);

        return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
    };

    const handleEndSession = () => {
        toast.success("Session ended");
        router.push(`/`);
    }

    return (
        <main>
        <Navbar sessionInProgress={true} />
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
        </main>
    );
}
