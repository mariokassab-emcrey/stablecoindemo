import React, { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { Copy } from 'lucide-react';

function MetaMaskLogin(props) {
  const [account, setAccount] = useState('');
  const [providerDetected, setProviderDetected] = useState(false);

  useEffect(() => {
    async function connectMetamask() {
      try {
        const provider = await Promise.race([
  await detectEthereumProvider(),
  new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
]);
      // const provider = await detectEthereumProvider();

      if (provider) {
        setProviderDetected(true);
        try {
          // Request accounts on component mount
          const accounts = await provider.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            props.fillAccount(accounts[0]);
          }
        } catch (error) {
          console.error("User rejected connection or other error:", error);
          // Handle specific errors, e.g., user rejection
        }
      } else {
        console.log('MetaMask not detected. Please install it.');
        // Provide instructions to the user to install MetaMask
      }
       } catch (error) {
          console.error("User rejected connection or other error:", error);
          // Handle specific errors, e.g., user rejection
        }
    }

    connectMetamask();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div style={{color: 'White'}}>
      {providerDetected ? (
        account ? (
          <div style={{display:'flex'}}>
            <p style={{paddingRight:'10px'}} class="text-sm text-gray-300">{props.truncateEthAddress(account)} </p>
            <button onClick={()=>props.copyTextToClipboard(account)}><Copy size={12} /></button>
            {/* 
            <button onClick={()=>props.copyTextToClipboard(account)} >
              <Copy size={12}/>
            </button>
            */}
          </div>
        ) : (
          <p class="text-lg font-semibold text-white">Connecting to MetaMask...</p>
        )
      ) : (
        <p class="text-lg font-semibold text-white">Please install MetaMask to connect.</p>
      )}
    </div>
  );
}

export default MetaMaskLogin;