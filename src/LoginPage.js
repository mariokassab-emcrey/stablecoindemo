import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";

const LoginPage = ({ admin, setAdmin }) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("loggedIn successfully")
      setAdmin(userCredential.user);
      alert("Logged in successfully!");
      return
    } catch (error) {
      console.error("Error logging in: ", error);
      alert("Login failed. Please check your credentials."+error);
    }
  };

  if (admin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
      <input style={{color:'black'}}
        type="email"
        placeholder="Email"
        className="input-text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input style={{color:'black'}}
        type="password"
        placeholder="Password"
        className="input-text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="button"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;