'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "@/components/Navbar/Navbar";

const axios = require('axios')
const FormData = require('form-data')

export default function CreateSession() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState('1');
  const [selectedName, setSelectedName] = useState('Vaibhav');

  const [query, setQuery] = useState('');
  const [queryURL, setQueryURL] = useState(null);

  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  const [uploadedtoIPFS, setUploadedtoIPFS] = useState(false);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreateSession = () => {
    toast.success("Session created successfully");
    const timevalue = selectedTime * 60;
    setTimeout(() => {
      router.push(`/timer?time=${timevalue}`);
    }, 1000);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();

    if (!file) {
      toast.warn('Please select a file');
      return;
    }

    formData.append('file', file);

    const metadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('metadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('options', options);

    try {
      toast.loading('Uploading File');
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
            'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
          },
        }
      );
      console.log(res.data);
      toast.dismiss()
      toast.success('Uploaded to IPFS');
    } catch (error) {
      console.log(error);
      toast.error('Not Uploaded to IPFS');
    }
  };

  return (
    <>
      <Navbar />
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
            <label className="block font-bold">Upload File</label>
            <input
              type="file"
              accept=".pdf, .doc, .docx, .pptx, .xlsx"
              onChange={handleFileChange}
              className="text-white w-full border rounded p-2"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleFileUpload}
              className={`bg-blue-500 text-white py-2 px-4 rounded cursor-pointer ${!uploadedtoIPFS ? "" : "bg-gray-400 pointer-events-none"
                }`}
            >
              Upload to IPFS
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={handleCreateSession}
              className={`bg-blue-500 text-white py-2 px-4 rounded cursor-pointer ${uploadedtoIPFS ? "" : "bg-gray-400 pointer-events-none"
                }`}
              disabled={!uploadedtoIPFS}
            >
              Create Session
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};