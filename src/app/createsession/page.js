'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "@/components/Navbar/Navbar";
import SessionFactory from '../../../artifacts/contracts/Session.sol/SessionFactory.json';

const axios = require('axios')
const FormData = require('form-data')

export default function CreateSession() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState('1');
  const [selectedTutor, setSelectedTutor] = useState('0x0C2a1797D2EC0a0Cbcc7b611382F8e1E58fA6091');

  const [query, setQuery] = useState('');

  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState(null);

  const [uploadedtoIPFS, setUploadedtoIPFS] = useState(false);

  const maticPerMinute = 0.012;
  const [amount, setAmount] = useState((selectedTime * maticPerMinute).toFixed(3));

  const [address, setAddress] = useState('');

  const handleNameChange = (e) => {
    setSelectedTutor(e.target.value);
  }

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setAmount((e.target.value * maticPerMinute).toFixed(3));
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

    const amountToTransfer = ethers.utils.parseEther(amount.toString());
    setSelectedTime(selectedTime * 60);

    console.log(amountToTransfer.toString());

    const sessionData = await contract.createSession(
      selectedTutor,
      query,
      selectedTime,
      amountToTransfer,
      fileHash
    );
    toast.loading("Creating the Session");

    const receipt = await sessionData.wait();
    console.log(receipt);

    let sessionAddress = null;
    if (receipt.contractAddress === null) {
      // Wait and check for the contract address in subsequent blocks
      const waitBlocks = 5; // Adjust this value as needed
      const startBlock = receipt.blockNumber;
      let currentBlock = startBlock;

      while (currentBlock - startBlock < waitBlocks && sessionAddress === null) {
        const currentReceipt = await provider.getTransactionReceipt(receipt.transactionHash);
        sessionAddress = currentReceipt.contractAddress;
        currentBlock = currentReceipt.blockNumber;
        // Sleep for a short time before checking again
        await new Promise(resolve => setTimeout(resolve, 3000)); // Adjust delay time if needed
      }
    } else {
      sessionAddress = receipt.contractAddress;
    }

    console.log(sessionData);
    console.log("Session Address:", sessionAddress);

    setAddress(receipt.contractAddress);

    toast.dismiss();
    toast.success("Session created successfully");
  };

  useEffect(() => {
    console.log(address);
    if (address) {
      router.push(`/timer?address=${address}&tutor=${selectedTutor}&time=${selectedTime}&amount=${amount}&query=${query}&file=${fileHash}`);
    }
  }, [address]);

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
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <div className="w-1/2 border p-8 rounded-lg">
          <div className="w-1/2">
            <label className="block font-bold">Select Tutor</label>
            <select
              value={selectedTutor}
              onChange={handleNameChange}
              className="text-black w-full border rounded p-2"
            >
              <option value="0x0C2a1797D2EC0a0Cbcc7b611382F8e1E58fA6091">Vaibhav</option>
              <option value="0x5c96e646905EE5446a727E588542C4a273D8c8a9">Manasvi</option>
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