'use client'

import { createContext, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "@/components/Navbar/Navbar";

const Session = createContext();

export default function CreateSession() {
  const router = useRouter();
  const [uploadedtoIPFS, setUploadedtoIPFS] = useState(false);
  const [selectedTime, setSelectedTime] = useState('1');
  const [selectedName, setSelectedName] = useState('Vaibhav');
  const [query, setQuery] = useState('');
  const maticPerMinute = 0.012;
  const amount = (selectedTime * maticPerMinute).toFixed(3);

  const handleNameChange = (e) => {
    setSelectedName(e.target.value);
  }

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleCreateSession = () => {
    toast.success("Session created successfully");
    const timevalue = selectedTime*60;
    setTimeout(() => {
      router.push(`/timer?time=${timevalue}`);
    }, 1000);
  };

  const handleupload = () => {
    toast.success("Uploaded to IPFS");
    setUploadedtoIPFS(true);
  }

  return (
    <>
    <Navbar />
    <Session.Provider value={{ selectedTime, setSelectedTime }}>
      <div className="flex justify-center items-center h-screen">
        <div className="w-1/2 border p-8 rounded-lg">
          <div className="w-1/2">
            <label className="block font-bold">Select Tutor</label>
            <select
              value={selectedName}
              onChange={handleNameChange}
              className="text-black w-full border rounded p-2"
            >
              <option value="Vaibhav">Vaibhav</option>
              <option value="Manasvi">Manasvi</option>
            </select>
          </div>
          <div className=" mt-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block font-bold">Select Time</label>
              <select
                value={selectedTime}
                onChange={handleTimeChange}
                className="text-black w-full border rounded p-2"
              >
                <option value="1">1 Minute</option>
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block font-bold">Amount</label>
              <input
                type="text"
                value={amount}
                readOnly
                className="text-black w-full border rounded p-2" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-bold">Enter Queries</label>
            <textarea
              value={query}
              onChange={handleQueryChange}
              className="text-black w-full border rounded p-2"
              rows="5" />
          </div>
          <div className="mt-4">
            <button
              onClick={handleupload}
              className={`bg-blue-500 text-white py-2 px-4 rounded cursor-pointer ${
                !uploadedtoIPFS ? "" : "bg-gray-400 pointer-events-none"
              }`}
            >
              Upload to IPFS
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={handleCreateSession}
              className={`bg-blue-500 text-white py-2 px-4 rounded cursor-pointer ${
                uploadedtoIPFS ? "" : "bg-gray-400 pointer-events-none"
              }`}
              disabled={!uploadedtoIPFS}
            >
              Create Session
            </button>
          </div>
        </div>
      </div>
    </Session.Provider>
    <ToastContainer />
    </>
  );
};

export { Session }
