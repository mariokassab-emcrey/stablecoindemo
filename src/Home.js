import React, { useState, useEffect } from 'react';
import * as ethers from "../node_modules/ethers/dist/ethers.min.js";
import EmcreyLogo from './images/emcrey-logo.png'
import Transactions from './Transactions.js'
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Settings } from 'lucide-react';
import MetaMaskLogin from './metamaskLogin/MetaMaskLogin.js';
import PayDialog from './Paydialog.js'
import AccountBookDialog from './AccountBookdialog.js';
function Home() {
    // Declare a state variable to hold the input's value
    const [account, setAccount] = useState('');
    var [balance, setBalance] = useState('0');
    var [gasBalance, setGasBalance] = useState('0');
    //const [provider, setProvider] = useState();
    //const [metaMaskAccount,setMetaMaskAccount] = useState('');
    //const [readStablecoinContract,setReadStablecoinContract] = useState();
    const [Status, setStatus] = useState();
    const [childKey, setChildKey] = useState(0);
    const [array, setArray] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
          try {
           
            const menuCollection = await getDocs(collection(db, "Transaction"));
            //console.log("TransactionDateTime.seconds" + menuCollection.docs[0].data().TransactionDateTime)
            //console.log("(new Date(doc.data().TransactionDateTime.seconds * 1000)).toLocaleString" + new Date(menuCollection.docs[0].data().TransactionDateTime.seconds * 1000))
            const transactions = menuCollection.docs.map((doc) => ({
              ID: doc.id,
              From: doc.data().From,
              Name: doc.data().Name,
              To: doc.data().To,
              Amount: doc.data().Amount,
              TransactionDateTime: (new Date(doc.data().TransactionDateTime.seconds * 1000)).toString(),
              Type: doc.data().Type,
              Status: doc.data().Status
    
            }));
            //console.log(transactions.length)
            setArray(transactions);
    
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
        };
        fetchTransactions();
      }, []);

    const addDataToArray = (data) => {
        setArray((prevArray) => [...prevArray, data]);
    };
    const updateStatus = (Success) => {
    setArray((prevArray) =>
            prevArray.map((item) => {
            if (item.Status === 'Pending') {
                return { ...item, Status: Success === 'true' ? 'Success' :'Failed' };
            }
            return item;
            })
        );
    };

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
    function getCurrentDate(separator = '') {
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
    }
    function truncateDecimals(numberString, trunk) {
        return Number(numberString).toFixed(trunk);
    }

    var provider;
    var metaMaskAccount;
    var readStablecoinContract;

    async function initProvider() {
        //    const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/782de316e7de460cb85dcc3d5feb17e4');
        //setProvider( new ethers.BrowserProvider(window.ethereum, 'sepolia') );
        provider = new ethers.BrowserProvider(window.ethereum, 'sepolia');
        const metaMaskAccounts = await provider.send("eth_requestAccounts", []);
        metaMaskAccount = metaMaskAccounts[0];
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
        const contractAddress = "0x78d5c26b106fac0b77f7cd7e864909c8ccf72ae0";
        readStablecoinContract = new ethers.Contract(contractAddress, erc20iAbi, provider);
        getBalance();
    }

    async function getBalance() {
        await provider.getBalance(metaMaskAccount).then((returnedValue) => {

            const element = document.getElementById("balanceETH");
            const newGasBalance = ethers.formatUnits(returnedValue, 18);
            if(element){
                element.innerText = truncateDecimals(newGasBalance,6);

                element.classList.remove('text-white');
                if (gasBalance == newGasBalance) {
                    element.classList.add('text-gray-500');
                } else
                    if (gasBalance < newGasBalance) {
                        element.classList.add('text-green-500');
                    } else
                        if (gasBalance > newGasBalance) {
                            element.classList.add('text-red-500');
                        }
            }
            setGasBalance( newGasBalance );
            
            // reset after 750ms
            setTimeout(() => {
                if(element){
                    element.classList.remove('text-gray-500');
                    element.classList.remove('text-green-500');
                    element.classList.remove('text-red-500');
                    element.classList.add('text-white');
                }
            }, 750);

        }).catch((error) => {
            console.error(
                `Error fetching balance: ${error.message}.
              Code: ${error.code}. Data: ${error.data}`);
        });

        await readStablecoinContract.balanceOf(metaMaskAccount).then((returnedValue) => {
            const element = document.getElementById("balanceSC")
            const newSCBalance = ethers.formatUnits(returnedValue, 18);
            if(element){
                element.innerText = newSCBalance;

                element.classList.remove('text-white');
                if (balance == newSCBalance) {
                    element.classList.add('text-gray-400');
                } else
                    if (balance < newSCBalance) {
                        element.classList.add('text-green-400');
                    } else
                        if (balance > newSCBalance) {
                            element.classList.add('text-red-400');
                        }
            }
            setBalance(newSCBalance)

            // reset after 750ms
            setTimeout(function () {
                if(element){
                element.classList.remove('text-gray-400');
                element.classList.remove('text-green-400');
                element.classList.remove('text-red-400');
                element.classList.add('text-white');
                }
            }, 750);
        }).catch((error) => {
            console.error(
                `Error fetching contract balance: ${error.message}.
              Code: ${error.code}. Data: ${error.data}`);
        });
    }

    initProvider();
    provider.on('block', (blockNumber) => { getBalance(); });
{/*
    useEffect(() => { 
        getBalance() 
        provider.on('block', (blockNumber) => { getBalance(); });
    },[])
*/}

    return (
        <div>
            <div class="flex justify-between items-center mb-8" style={{ margin: '15px' }}>
                <div class="flex items-center gap-4">
                    <h1 class="text-3xl font-bold text-white">SAR Wallet</h1>
                    <span class="text-gray-300">{getCurrentDate('/')}</span>
                </div>

                <div class="flex items-center gap-3">
                    <Settings class="text-gray-300 hover:text-secondary p-1 rounded-full hover:bg-gray-700 transition-colors" />
                    <img src={EmcreyLogo} alt="eMcREY Logo" loading="lazy" />
                </div>
            </div>


            <div class="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6" style={{ margin: '15px' }}>
                <div class="flex justify-between items-center">
                    <div class="flex gap-8">
                        <div class="self-center">
                            <h2 class="text-lg font-semibold text-white">Account</h2>
                            <div class="flex items-center gap-1 mt-1">
                                <MetaMaskLogin truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard} fillAccount={(account) => { setAccount(account) }}></MetaMaskLogin>

                            </div>
                        </div>
                        <div class="self-center">
                            <h2 class="text-lg font-semibold text-white">Balance</h2>
                            <p id="balanceSC" class="text-white font-medium">{balance}</p>
                        </div>
                        <div class="self-center">
                            <h3 class="text-base font-semibold text-white">Network Gas</h3>
                            <p id="balanceETH" class="text-white  text-sm">{gasBalance}</p>
                        </div>
                        <div class="self-center">
                            <PayDialog updateStatus={updateStatus} addDataToArray={addDataToArray} truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard} account={account} balance={balance} gasFees={gasBalance} />
                        </div>
                        <div class="self-center">
                            <AccountBookDialog truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard} mainAccount={account} />
                        </div>
                    </div>
                    <button class="text-sm font-medium text-button hover:text-white hover:bg-gray-700 px-3 py-1 rounded  transition-colors border border-button focus:outline-none">
                        Change Account
                    </button>
                </div>
            </div>
            <div id="transaction" class="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6" style={{ margin: '15px' }}>
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-lg font-semibold text-white">Transactions</h3>
                    <button
                        id="showAllBtn"
                        class="text-sm font-medium text-button hover:text-white hover:bg-gray-700 px-3 py-1 rounded  transition-colors border border-button focus:outline-none" onClick={async () => {
                            const contractAddress = "0x78d5c26b106fac0b77f7cd7e864909c8ccf72ae0";
                            const provider = new ethers.BrowserProvider(window.ethereum, 'sepolia');
                            const metaMaskAccounts = await provider.send("eth_requestAccounts", []);
                            const metaMaskAccount = metaMaskAccounts[0];
                            var url = "https://sepolia.etherscan.io/token/" + contractAddress + "?a=" + metaMaskAccount;
                            window.open(url, '_blank');
                        }}>
                        Show All
                    </button>
                </div>
                <Transactions transactions={array} account={account} truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard}></Transactions>
            </div>
        </div>
    );
}

export default Home;