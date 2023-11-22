'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import { Card } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SessionFactory from '../../../artifacts/contracts/Session.sol/SessionFactory.json';

const axios = require('axios')
const FormData = require('form-data')

export default function CreateSession() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState('1');
  const [checkTime, setCheckTime] = useState('1');

  const [selectedTutor, setSelectedTutor] = useState('0x0C2a1797D2EC0a0Cbcc7b611382F8e1E58fA6091');

  const [query, setQuery] = useState('');

  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState(null);

  const [uploadedtoIPFS, setUploadedtoIPFS] = useState(false);

  const maticPerMinute = 0.012;
  const [amount, setAmount] = useState((selectedTime * maticPerMinute).toFixed(3));
  const [checkAmount, setCheckAmount] = useState((selectedTime * maticPerMinute).toFixed(3));

  const [address, setAddress] = useState('');
  const [transactionid, setTransaction] = useState('');

  const handleNameChange = (e) => {
    setSelectedTutor(e.target.value);
  }

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setCheckTime(e.target.value);
    setAmount((e.target.value * maticPerMinute).toFixed(3));
    setCheckAmount((e.target.value * maticPerMinute).toFixed(3));
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreateSession = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ADDRESS,
      SessionFactory.abi,
      signer
    );

    const amountToTransfer = ethers.utils.parseEther(amount.toString())
    setAmount(amountToTransfer);
    setSelectedTime(selectedTime * 60);

    const sessionData = await contract.createSession(
      selectedTutor,
      query,
      selectedTime,
      amountToTransfer,
      fileHash
    );
    toast.loading("Creating the Session");

    await sessionData.wait();
    setAddress(sessionData.to);
    setTransaction(sessionData.hash);

    toast.dismiss();
    toast.success("Session created successfully");
  };

  useEffect(() => {
    console.log(amount.toString());
    console.log(address);
    if (address) {
      router.push(`/timer?address=${address}&tutor=${selectedTutor}&time=${selectedTime}&amount=${amount}&query=${query}&file=${fileHash}&transaction=${transactionid}`);
    }
  }, [address, amount]);

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
      setFileHash(res.data.IpfsHash);

      setUploadedtoIPFS(true);

      toast.dismiss();
      toast.success('Uploaded to IPFS');
    } catch (error) {
      console.log(error);
      toast.error('Not Uploaded to IPFS');
    }
  };

  useEffect(() => {
    console.log(fileHash);
  }, [fileHash]);

  return (
    <>
      <div className="m-10">
        <div className="flex justify-center items-center h-screen">
          <Card sx={{ padding: '20px', backgroundColor: '#333', color: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="w-1/2">
              <label className="block font-bold" style={{ color: '#FF9800' }}>Select Tutor</label>
              <select
                value={selectedTutor}
                onChange={handleNameChange}
                className="text-black w-full border rounded p-2"
              >
                <option value="0x0C2a1797D2EC0a0Cbcc7b611382F8e1E58fA6091">Tutor 1</option>
                <option value="0x5c96e646905EE5446a727E588542C4a273D8c8a9">Tutor 2</option>
              </select>
            </div>
            <div className=" mt-4 flex space-x-4">
              <div className="w-1/2">
                <label className="block font-bold" style={{ color: '#FF9800' }}>Select Time</label>
                <select
                  value={checkTime}
                  onChange={handleTimeChange}
                  className="text-black w-full border rounded p-2"
                >
                  <option value="1">1 Minute</option>
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block font-bold" style={{ color: '#FF9800' }}>Amount</label>
                <input
                  type="text"
                  value={checkAmount}
                  readOnly
                  className="text-black w-full border rounded p-2" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-bold" style={{ color: '#FF9800' }}>Enter Queries</label>
              <textarea
                value={query}
                onChange={handleQueryChange}
                className="text-black w-full border rounded p-2"
                rows="5" />
            </div>
            <div className="mt-4">
              <label className="block font-bold" style={{ color: '#FF9800' }}>Upload File</label>
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
                style={{ backgroundColor: !uploadedtoIPFS ? '#FF9800' : '#CCCCCC' }}
                className={`text-white py-2 px-4 rounded cursor-pointer`}
                disabled={uploadedtoIPFS}
              >
                Upload to IPFS
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={handleCreateSession}
                style={{ backgroundColor: uploadedtoIPFS ? '#FF9800' : '#CCCCCC' }} 
                className={`text-white py-2 px-4 rounded cursor-pointer`}
                disabled={!uploadedtoIPFS}
              >
                Create Session
              </button>
            </div>
          </Card>
        </div>
      </div >
      <ToastContainer />
    </>
  );
};