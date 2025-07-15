import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import WhitelistDialog from './Whitelistdialog'
import { ethers } from 'ethers';
import contractAbi from './RUH25ABI.json';
import {  Button } from "react-bootstrap";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
const [totalSupply, setTotalSupply] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [loading, setLoading] = useState(true);
   const [contractAddress,setContractAddress] = useState('0xe987da3236b978c452519fea733833ea5accba4b');
    const [tokenID,setTokenID] = useState(1245);
  useEffect(() => {
    const loadSupply = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not installed");

       const provider = new ethers.BrowserProvider(window.ethereum);
       const signer = await provider.getSigner();
     const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        const [rawSupply, rawDecimals] = await Promise.all([
          contract.totalSupply(),
          contract.decimals(),
        ]);

        setDecimals(rawDecimals);
        const formatted = ethers.formatUnits(rawSupply, rawDecimals);
        setTotalSupply(formatted);
      } catch (err) {
        console.error("Error fetching total supply:", err);
        setTotalSupply("Error");
      } finally {
        setLoading(false);
      }
    };

    loadSupply();
  }, []);
  // useEffect(() => {
  // getTotalSupply();
  // }, []);
  
  //  const getTotalSupply = async () => {
  // // const provider = new ethers.JsonRpcProvider('https://fluent-chaotic-lake.ethereum-sepolia.quiknode.pro/b989ab5dc846e9bfab7637b37a5b36f0bcd11fb5/');
  // const provider = new ethers.BrowserProvider(window.ethereum);
  // const signer = await provider.getSigner();
  // const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  // setTotalSupply( await contract.totalSupply())
     
  //   };
       const IssueToken = async () => {
  // const provider = new ethers.JsonRpcProvider('https://fluent-chaotic-lake.ethereum-sepolia.quiknode.pro/b989ab5dc846e9bfab7637b37a5b36f0bcd11fb5/');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
   await contract.createEQARFromDefinitionFor('0xa796b101e2eed141c887cb0ce68332c1ca059587',tokenID,100000000000000)
     
    };
    const BurnToken = async () => {
  // const provider = new ethers.JsonRpcProvider('https://fluent-chaotic-lake.ethereum-sepolia.quiknode.pro/b989ab5dc846e9bfab7637b37a5b36f0bcd11fb5/');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
   await contract.burnFor('0xa796b101e2eed141c887cb0ce68332c1ca059587',100000000000000)
     
    };
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

  

  return (
    <>
      <h1 style={{color:'white'}}>Admin Content</h1>
      <WhitelistDialog truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard}></WhitelistDialog>
      <div>
      <h2>Total Supply</h2>
      <p style={{color:'white'}}>tokens {totalSupply} tokens</p>
      <Button style={{color:'white'}} onClick={IssueToken}>Issue token</Button>
      <Button style={{color:'white'}} onClick={BurnToken}>Burn token</Button>
    </div>
    </>
  );
};

export default AdminDashboard;
