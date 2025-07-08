import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
import WhitelistDialog from './Whitelistdialog'

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  function truncateEthAddress(address) {
        var truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
        var match = address.match(truncateRegex);
        if (!match)
            return address;
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
    <><h1 style={{color:'white'}}>Admin Content</h1>
    <WhitelistDialog truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard}></WhitelistDialog>
    </>
  );
};

export default AdminDashboard;

