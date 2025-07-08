import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import AdminDashboard from "./AdminDashboard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import LoginPage from "./LoginPage";
import Home from "./Home";
import "./App.css";
function InitPage() {
    
     const [admin, setAdmin] = useState(null);
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const auth = getAuth();
    
      useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          setAdmin(user);
        });
      }, [auth]);
    
  
    
      const handleLogin = async () => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          setAdmin(userCredential.user);
          alert("Logged in successfully!");
        } catch (error) {
          console.error("Error logging in: ", error);
          alert("Login failed. Please check your credentials.");
        }
      };
    
      const handleLogout = async () => {
        try {
          await signOut(auth);
          setAdmin(null);
          alert("Logged out successfully!");
          window.location.href = "/"; // Redirect to menu after logout
        } catch (error) {
          console.error("Error logging out: ", error);
          alert("Failed to log out.");
        }
      };
    
   
    return (
         <Router><div>
                     {admin ? (
                       <>
                         {/* <Link to="/admin" className="mr-4 text-gold hover:underline">Admin Dashboard</Link> */}
                         <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                           Logout
                         </button>
                       </>
                     ) : (
                       <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                         Admin Login
                       </Link>
                     )}
                   </div>
                   <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<LoginPage admin={admin} setAdmin={setAdmin}/>} />
                    <Route path="/admin" element={admin ? (
                                <>
                                  <AdminDashboard />
                                  {/* <div className='mt-10 p-6 bg-gray-900 rounded-lg'>
                                    <h2 className='text-2xl font-bold mb-4'>Admin Tools</h2>
                           
                                  </div> */}
                                </>
                              ) : <Navigate to="/login" />} />
                    </Routes></Router>
        
    );
}

export default InitPage;