import React, { useState,useEffect } from 'react';
import * as ethers from "../node_modules/ethers/dist/ethers.min.js";
import EmcreyLogo from './images/emcrey-logo.png'
import MetaMaskLogin from './metamaskLogin/MetaMaskLogin.js';
import MyDialog from './dialog.js'
function TextInputExample() {
  // Declare a state variable to hold the input's value
  const [inputValue, setInputValue] = useState('');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
    const [gasFees, setGasfees] = useState('');
  // Event handler to update the state when the input changes
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
async function getBalance(){
    const erc20iAbi = [
  // Some details about the token
  "function name() view returns (string)",
  "function symbol() view returns (string)",

  // Get the account balance
  "function balanceOf(address) view returns (uint)",

  // Send some of your tokens to someone else
  "function transfer(address to, uint amount)",

  // An event triggered whenever anyone transfers to someone else
  "event Transfer(address indexed from, address indexed to, uint amount)"
];
    const provider = new ethers.BrowserProvider(window.ethereum, 'sepolia');
    const metaMaskAccounts = await provider.send("eth_requestAccounts", []);
const metaMaskAccount = metaMaskAccounts[0];
var gasBalance = 0;
        var scBalance = 0;
        const contractAddress = "0x78d5c26b106fac0b77f7cd7e864909c8ccf72ae0";
const readStablecoinContract = new ethers.Contract(contractAddress, erc20iAbi, provider);
   await    provider.getBalance(metaMaskAccount).then((balance) => {
        
          const element = document.getElementById("balanceETH");
          const elementPay = document.getElementById("payBalanceETH");
          const newGasBalance = ethers.formatUnits(balance, 18);
          element.innerText = newGasBalance;
          elementPay.innerText = newGasBalance;
          
          //blink: green:increase, red:decrease, gray:unchanged 
          element.classList.remove('text-gray-300');
          elementPay.classList.remove('text-gray-300');
          if (gasBalance == newGasBalance) {
             element.classList.add('text-gray-500');
             elementPay.classList.add('text-gray-500');
          } else
          if (gasBalance < newGasBalance) {
             element.classList.add('text-green-500');
             elementPay.classList.add('text-green-500');
          } else
          if (gasBalance > newGasBalance) {
             element.classList.add('text-red-500');
             elementPay.classList.add('text-red-500');
          }
          gasBalance = newGasBalance;
          console.log("newGasBalance"+newGasBalance)
          setGasfees(newGasBalance)
          // reset after 750ms
          setTimeout(function() {
             element.classList.remove('text-gray-500');
             element.classList.remove('text-green-500');
             element.classList.remove('text-red-500');
             element.classList.add('text-gray-300');
             elementPay.classList.remove('text-gray-500');
             elementPay.classList.remove('text-green-500');
             elementPay.classList.remove('text-red-500');
             elementPay.classList.add('text-gray-300');
          }, 750);
       }).catch((error) => 
          { console.error(
             `Error fetching balance: ${error.message}.
              Code: ${error.code}. Data: ${error.data}`);
          });
    
      await readStablecoinContract.balanceOf(metaMaskAccount).then((balance) => {
          const element = document.getElementById("balanceSC")
          const elementPay = document.getElementById("payBalanceSC")
          var newSCBalance = ethers.formatUnits(balance, 18);
          element.innerText = newSCBalance;
          elementPay.innerText = newSCBalance;
    setBalance(newSCBalance)
          //blink: green:increase, red:decrease, gray:unchanged 
          element.classList.remove('text-primary');
          elementPay.classList.remove('text-primary');
          if (scBalance == newSCBalance) {
             element.classList.add('text-gray-400');
             elementPay.classList.add('text-gray-400');
          } else
          if (scBalance < newSCBalance) {
             element.classList.add('text-green-400');
             elementPay.classList.add('text-green-400');
          } else
          if (scBalance > newSCBalance) {
             element.classList.add('text-red-400');
             elementPay.classList.add('text-red-400');
          }
          scBalance = newSCBalance;

          // reset after 750ms
          setTimeout(function() {
             element.classList.remove('text-gray-400');
             element.classList.remove('text-green-400');
             element.classList.remove('text-red-400');
             element.classList.add('text-primary');
             elementPay.classList.remove('text-gray-400');
             elementPay.classList.remove('text-green-400');
             elementPay.classList.remove('text-red-400');
             elementPay.classList.add('text-primary');
          }, 750);
       }).catch((error) => 
          { console.error(
             `Error fetching contract balance: ${error.message}.
              Code: ${error.code}. Data: ${error.data}`);
          });
    }
  useEffect(() => {getBalance()})
  return (
     <div>
      <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-4">
                <h1 class="text-3xl font-bold text-primary">SAR Wallet</h1>
               
                <span id="date" class="text-gray-300">Today, June 15, 2023</span>
            </div>
            
            <div class="flex items-center gap-3">
                <button class="text-gray-300 hover:text-secondary p-1 rounded-full hover:bg-gray-700 transition-colors">
             
                </button>
                <img 
                    src={EmcreyLogo} alt="eMcREY Logo"
                    loading="lazy"
                />
            </div>
        </div>
        
       {/* <label htmlFor="myInput">Enter text:</label>
       <input
        type="text"
        id="myInput"
        value={inputValue} // Bind the input's value to the state variable
        onChange={handleChange} // Update the state on change
        placeholder="Type something..."
      />
      <p>Current input value: {inputValue}</p> */}
       <div class="bg-card rounded-lg shadow-lg px-6 py-1 border border-gray-700 mb-6">
            <div class="flex justify-between items-center">
                <div class="flex gap-8">
                    <div class="self-center">
                        <h2 class="text-lg font-semibold text-primary">Account</h2>
                        <div class="flex items-center gap-1 mt-1">
                           <MetaMaskLogin fillAccount={(account)=>{setAccount(account)}}></MetaMaskLogin>
                        
                        </div>
                    </div>
                    <div class="self-center">
                        <h2 class="text-lg font-semibold text-primary">Balance</h2>
                        <p id="balanceSC" class="text-primary font-medium">{balance}</p>
                    </div>
                    <div class="self-center">
                        <h3 class="text-base font-semibold text-gray-400">Network Gas</h3>
                        <p id="balanceETH" class="text-gray-400 text-sm">{gasFees}</p>
                    </div>

                 
                    
                   
                    

                    <div class="self-center">
                       <MyDialog account={account} balance={balance} gasFees={gasFees}>
                        
                    </MyDialog>
                    
                    </div>


                    <div class="self-center">
                        <button id="accountReceive" class="text-secondary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-secondary">Receive</button>
                    </div>
                </div>
                <button class="text-secondary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-secondary">
                    Change Account
                </button>
            </div>
            
        </div>
        <div id="transaction" class="bg-card rounded-lg shadow-lg px-6 py-1 border border-gray-700 mb-6">
            <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-semibold text-primary">Transactions</h3>
                <button 
                    id="showAllBtn"
                    class="text-secondary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-secondary">
                    Show All
                </button>
            </div>
            
            <div class="space-y-4">
                <div class="grid grid-cols-12 items-center gap-4 p-1 hover:bg-gray-700 rounded">
                    <div class="col-span-1 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                     
                    </div>
                    <div class="col-span-2">
                        <h2 class="text-lg font-semibold text-primary">Jacks Coffee</h2>
                        <div class="display: flex gap-1">
                           <span id="displayMetaMaskAddress" class="text-sm text-gray-300">0x5e6f...7g8h</span>
                         
                        </div>  
                    </div>
                    <div class="col-span-2">
                        <h2 class="text-lg font-semibold text-primary">Mada card</h2>
                    </div>
                    <div class="col-span-2 flex-direction: column justify-center mt-1">
                        <p class="text-sm text-gray-300">Mon 15 Jun 2023</p>
                        <p class="text-sm text-gray-300">18:35</p>
                    </div>
                    <div class="col-span-5 text-right">
                        <p class="text-red-400 font-mono">-20.0000</p>
                    </div>
                </div>

                <div class="grid grid-cols-12 items-center gap-4 p-1 hover:bg-gray-700 rounded">
                    <div class="col-span-1 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                       
                    </div>
                    <div class="col-span-2">
                        <h2 class="text-lg font-semibold text-primary">Rami</h2>
                        <div class="display: flex gap-1">
                           <span id="displayMetaMaskAddress" class="text-sm text-gray-300">0x6f12...6h23</span>
                       
                        </div>  
                    </div>
                    <div class="col-span-2">
                        <h2 class="text-lg font-semibold text-primary">Main account</h2>
                    </div>
                    <div class="col-span-2 flex-direction: column justify-center mt-1">
                        <p class="text-sm text-gray-300">Mon 14 Jun 2023</p>
                        <p class="text-sm text-gray-300">09:56</p>
                    </div>
                    <div class="col-span-5 text-right">
                        <p class="text-green-400 font-mono">+1,234.5678</p>
                    </div>
                </div>

            </div>
        </div>
        {/* <div class="bg-card rounded-lg shadow-lg px-6 py-1 border border-gray-700">
            <h3 class="text-lg font-semibold text-primary mb-2">Sub Accounts</h3>
            
            <div class="space-y-4">
                <div class="grid grid-cols-12 items-center gap-4 p-1 hover:bg-gray-700 rounded">

                    <div class="col-span-1 credit-card w-10 h-10">
                        <i data-lucide="credit-card" class="w-5 h-5 text-white"></i>
                    </div>
                    <div class="col-span-3 min-w-0">
                        <h3 class="font-medium text-primary truncate">Mada Card</h3>
                        <div class="flex items-center gap-1">
                            <span class="text-xs text-gray-300">0x89d...0359</span>
                            <i data-lucide="copy" class="w-3 h-3 text-gray-400 hover:text-secondary cursor-pointer" 
                               onclick="copyToClipboard('0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359')"></i>
                        </div>
                        <p class="text-xs text-gray-300 mt-1">**** 1234</p>
                    </div>
                    <div class="col-span-5 flex items-center">
                        <div class="text-center">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Allowance</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                                </button>
                            </div>
                            <p class="font-medium text-primary">10,000.0000</p>
                        </div>
                        <div class="text-center ml-4">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Transaction Limit</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                                </button>
                            </div>
                            <p class="font-medium text-primary">5,000.0000</p>
                        </div>
                        <div class="text-center ml-4">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Next Tx Allowance</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                                </button>
                            </div>
                            <p class="font-medium text-primary">Not set</p>
                        </div>
                    </div>
                    <div class="col-span-3 text-right">
                        <button id="subAccount1Pay" class="text-secondary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-secondary">Pay</button>
                        <button class="ml-4 text-secondary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-secondary">
                            Transactions
                        </button>
                    </div> */}
    </div>
  );
}

export default TextInputExample;