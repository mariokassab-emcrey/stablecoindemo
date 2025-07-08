import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);

  

  return (
    <><h1>Admin</h1></>
  );
};

export default AdminDashboard;

