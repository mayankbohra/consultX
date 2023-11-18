'use client'

import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from "ethers";

const networks = {
  polygon: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Polygon Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};

const Wallet = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    console.log("connectWallet function called");
    if (!window.ethereum) {
      toast.error("No Wallet Found!");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (chainId !== networks.polygon.chainId) {
        toast.warn("Please connect to the Polygon network");
        return;
      }

      const account = provider.getSigner();
      const Address = await account.getAddress();
      setAddress(Address);

      const Balance = ethers.utils.formatEther(await account.getBalance());
      setBalance(Balance);

      setConnected(true);
    } catch (error) {
      console.error("Error connecting wallet: ", error);
    }
  };

  return (
    <div>
      {connected ? (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-full">
          <div className="text-right">{address.slice(0, 6)}...{address.slice(39)}</div>
          <div className="text-right">{balance.slice(0, 4)} Matic</div>
        </div>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Wallet;