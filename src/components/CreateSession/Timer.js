import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Session} from '../../app/createsession/page.js';

export default function Timer() {
  const Handler = useContext(Session);

  const selectedTime = Handler.selectedTime;

  const selectedTimeInSeconds = parseInt(selectedTime, 10) * 60;
  const [timeLeft, setTimeLeft] = useState(selectedTimeInSeconds);

  useEffect(() => {
    let interval;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      toast.info('Timer has ended.');
    }
  }, [timeLeft]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 border p-8 rounded-lg">
        <h2 className="text-2xl font-semibold">Timer</h2>
        <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
      </div>
    </div>
  );
}
