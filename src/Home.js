import React, { useState, useEffect } from 'react';
import * as ethers from "../node_modules/ethers/dist/ethers.min.js";
import EmcreyLogo from './images/emcrey-logo.png'
import Transactions from './Transactions.js'

import { Settings } from 'lucide-react';
import MetaMaskLogin from './metamaskLogin/MetaMaskLogin.js';
import PayDialog from './Paydialog.js'
import AccountBookDialog from './AccountBookdialog.js';
function Home() {
    // Declare a state variable to hold the input's value
    const [inputValue, setInputValue] = useState('');
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('0');
    const [gasFees, setGasfees] = useState('0');
    const [Status, setStatus] = useState();
    // Event handler to update the state when the input changes
    const handleChange = (event) => {
        setInputValue(event.target.value);
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

    async function getBalance() {
        try {
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
            const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/782de316e7de460cb85dcc3d5feb17e4');

            // const provider = new ethers.BrowserProvider(window.ethereum, 'sepolia');
            const metaMaskAccounts = await provider.send("eth_requestAccounts", []);
            const metaMaskAccount = metaMaskAccounts[0];
            console.log("metaMaskAccount" + metaMaskAccount);
            const contractAddress = "0x78d5c26b106fac0b77f7cd7e864909c8ccf72ae0";
            const readStablecoinContract = new ethers.Contract(contractAddress, erc20iAbi, provider);
            console.log("before getting the balance"); // Add this line to see if the balance is being fetched
            const balance = await Promise.race([
                provider.getBalance(metaMaskAccount),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
            ]);


            // const balance = await provider.getBalance(metaMaskAccount);
            console.log("Balance:", balance); // Add this line to see if the balance is being fetched
            const newGasBalance = ethers.formatUnits(balance, 18);
            setGasfees(newGasBalance);

            const contractBalance = await readStablecoinContract.balanceOf(metaMaskAccount);

            const newSCBalance = ethers.formatUnits(contractBalance, 18);
            setBalance(newSCBalance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }



    async function getBalance() {
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
        await provider.getBalance(metaMaskAccount).then((balance) => {

            const element = document.getElementById("balanceETH");
            //   const elementPay = document.getElementById("payBalanceETH");
            const newGasBalance = ethers.formatUnits(balance, 18);
            element.innerText = newGasBalance;

            //   elementPay.innerText = newGasBal
            // ance;

            //blink: green:increase, red:decrease, gray:unchanged 
            element.classList.remove('text-white');
            //   elementPay.classList.remove('text-gray-300');
            if (gasBalance == newGasBalance) {
                element.classList.add('text-gray-500');
                //  elementPay.classList.add('text-gray-500');
            } else
                if (gasBalance < newGasBalance) {
                    element.classList.add('text-green-500');
                    //  elementPay.classList.add('text-green-500');
                } else
                    if (gasBalance > newGasBalance) {
                        element.classList.add('text-red-500');
                        //  elementPay.classList.add('text-red-500');
                    }
            gasBalance = newGasBalance;
            // reset after 750ms
            setTimeout(() => {
                element.classList.remove('text-gray-500');
                element.classList.remove('text-green-500');
                element.classList.remove('text-red-500');
                element.classList.add('text-white');
                //  elementPay.classList.remove('text-gray-500');
                //  elementPay.classList.remove('text-green-500');
                //  elementPay.classList.remove('text-red-500');
                //  elementPay.classList.add('text-gray-300');
            }, 750);
        }).catch((error) => {
            console.error(
                `Error fetching balance: ${error.message}.
              Code: ${error.code}. Data: ${error.data}`);
        });

        await readStablecoinContract.balanceOf(metaMaskAccount).then((balance) => {
            const element = document.getElementById("balanceSC")
            //   const elementPay = document.getElementById("payBalanceSC")
            var newSCBalance = ethers.formatUnits(balance, 18);
            element.innerText = newSCBalance;
            //   elementPay.innerText = newSCBalance;
            setBalance(newSCBalance)
            //blink: green:increase, red:decrease, gray:unchanged 
            element.classList.remove('text-white');
            //   elementPay.classList.remove('text-primary');
            if (scBalance == newSCBalance) {
                element.classList.add('text-gray-400');
                //  elementPay.classList.add('text-gray-400');
            } else
                if (scBalance < newSCBalance) {
                    element.classList.add('text-green-400');
                    //  elementPay.classList.add('text-green-400');
                } else
                    if (scBalance > newSCBalance) {
                        element.classList.add('text-red-400');
                        //  elementPay.classList.add('text-red-400');
                    }
            scBalance = newSCBalance;

            // reset after 750ms
            setTimeout(function () {
                element.classList.remove('text-gray-400');
                element.classList.remove('text-green-400');
                element.classList.remove('text-red-400');
                element.classList.add('text-white');
            }, 750);
        }).catch((error) => {
            console.error(
                `Error fetching contract balance: ${error.message}.
              Code: ${error.code}. Data: ${error.data}`);
        });
    }
    const provider = new ethers.BrowserProvider(window.ethereum, 'sepolia');
    provider.on('block', (blockNumber) => { getBalance(); });
    useEffect(() => { getBalance() })
    function getCurrentDate(separator = '') {

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
    }
    return (
        <div>
            <div class="flex justify-between items-center mb-8" style={{ margin: '15px' }}>
                <div class="flex items-center gap-4">
                    <h1 class="text-3xl font-bold text-white">SAR Wallet</h1>

                    <span class="text-gray-300">{new Date().toDateString()}</span>
                </div>

                <div class="flex items-center gap-3">
                    <Settings class="text-gray-300 hover:text-secondary p-1 rounded-full hover:bg-gray-700 transition-colors" />
                    <img src={EmcreyLogo} alt="eMcREY Logo" loading="lazy" />
                </div>
            </div>


            <div class="bg-card rounded-lg shadow-lg px-6 py-1  border-gray mb-6" style={{ margin: '15px' }}>
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
                            <p id="balanceETH" class="text-white  text-sm">{gasFees}</p>
                        </div>
                        <div class="self-center">
                            <PayDialog truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard} account={account} balance={balance} gasFees={gasFees} />
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
            <div id="transaction" class="bg-card rounded-lg shadow-lg px-6 py-1  border-gray-700 mb-6" style={{ margin: '15px' }}>
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
                <Transactions account={account} truncateEthAddress={truncateEthAddress} copyTextToClipboard={copyTextToClipboard}></Transactions>
            </div>
        </div>
    );
}

export default Home;