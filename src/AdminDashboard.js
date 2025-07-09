import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import WhitelistDialog from './Whitelistdialog'
import { ethers } from 'ethers';
import contractAbi from './DemoFFKSAABI.json';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);

  function truncateEthAddress(address) {
    var truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
    var match = address.match(truncateRegex);
    if (!match) return address;
    return match[1] + "\u2026" + match[2];
  };

  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  useEffect(() => {
    const callContractFunction = async () => {
      try {
        const contractAddress = '0xA4aB17BfB1F32a0671453dd2e40DE7c4FB0B0Fe2';
  const provider = new ethers.JsonRpcProvider('https://fluent-chaotic-lake.ethereum-sepolia.quiknode.pro/b989ab5dc846e9bfab7637b37a5b36f0bcd11fb5/');
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);
        const result = await contract.getTotalMinted();
        console.log("result"+result);
      } catch (error) {
        console.error('Error calling contract function:', error);
      }
    };
    callContractFunction();
  });

  return (
    <>
      <h1 style={{color:'white'}}>Admin Content</h1>
      <WhitelistDialog truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard}></WhitelistDialog>
    </>
  );
};

export default AdminDashboard;
