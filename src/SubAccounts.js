import React, { useRef,useState,useEffect } from 'react';
import { Table,Modal, Button, Row, Col, Form } from "react-bootstrap";
import './App.css';
import { collection, getDocs,addDoc,deleteDoc,doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Copy,ArrowDownRight,ArrowUpRight } from 'lucide-react';
import CreditCard from './images/creditCard.png'
function SubAccounts(props) {
  const dialogRef = useRef(null);
   const [Transactions, setTransactions] = useState([]);
 
  
useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const menuCollection = await getDocs(collection(db, "Transaction"));
      console.log("TransactionDateTime.seconds"+menuCollection.docs[0].data().TransactionDateTime)
      console.log("(new Date(doc.data().TransactionDateTime.seconds * 1000)).toLocaleString"+new Date(menuCollection.docs[0].data().TransactionDateTime.seconds * 1000))
      const transactions = menuCollection.docs.map((doc) => ({
        ID: doc.id,
        From: doc.data().From,
        Name: doc.data().Name,
        To: doc.data().To,
        Amount:  doc.data().Amount,
        TransactionDateTime : (new Date(doc.data().TransactionDateTime.seconds * 1000)).toString(),
        Type:doc.data().Type,
        
      }));
      console.log(transactions.length)
      setTransactions(transactions);
      
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  fetchTransactions();
}, []);

  return (
  <div class="bg-card rounded-lg shadow-lg px-6 py-1  border-gray-700" style={{margin:'15px'}}>
            <h3 class="text-lg font-semibold text-white mb-2">Sub Accounts</h3>
            
            <div class="space-y-4">
                <div class="grid grid-cols-12 items-center gap-4 p-1 hover:bg-gray-700 rounded">

                    <div class="col-span-1 credit-card w-10 h-10">
                  <img 
                    src={CreditCard} alt="Credit card"
                    loading="lazy"
                />
                    </div>
                    <div class="col-span-3 min-w-0">
                        <h3 class="font-medium text-white truncate">Mada Card</h3>
                        <div class="flex items-center gap-1">
                            <span class="text-xs text-gray-300">0x89d...0359</span>
                        </div>
                        <p class="text-xs text-gray-300 mt-1">**** 1234</p>
                    </div>
                    <div class="col-span-5 flex items-center">
                        <div class="text-center">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Allowance</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                </button>
                            </div>
                            <p class="font-medium text-white">10,000.0000</p>
                        </div>
                        <div class="text-center ml-4">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Transaction Limit</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                </button>
                            </div>
                            <p class="font-medium text-white">5,000.0000</p>
                        </div>
                        <div class="text-center ml-4">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Next Tx Allowance</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                </button>
                            </div>
                            <p class="font-medium text-white">Not set</p>
                        </div>
                    </div>
                    <div class="col-span-3 text-right">
                        <button id="subAccount1Pay" class="text-primary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-primary">Pay</button>
                        <button class="ml-4 text-primary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-primary">
                            Transactions
                        </button>
                    </div>




                </div>
                
                <div class="grid grid-cols-12 items-center gap-4 p-1 hover:bg-gray-700 rounded">
                    <div class="col-span-1 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <i data-lucide="user" class="w-5 h-5 text-secondary"></i>
                    </div>
                    <div class="col-span-3 min-w-0">
                        <h3 class="font-medium text-white truncate">Junior</h3>
                        <div class="flex items-center gap-1">
                            <span class="text-xs text-gray-300">0x2f3...C970</span>
                        </div>
                    </div>
                    <div class="col-span-5 flex items-center">
                        <div class="text-right">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Allowance</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                                </button>
                            </div>
                            <p class="font-medium text-white">8,500.0000</p>
                        </div>
                        <div class="text-right ml-4">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Transaction Limit</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                                </button>
                            </div>
                            <p class="font-medium text-white">4,000.0000</p>
                        </div>
                        <div class="text-center ml-4">
                            <div class="flex items-center gap-1 justify-end">
                                <p class="text-xs text-gray-300">Next Tx Allowance</p>
                                <button class="text-gray-400 hover:text-secondary p-1">
                                    <i data-lucide="edit-2" class="w-3 h-3"></i>
                                </button>
                            </div>
                            <p class="font-medium text-white justify-end">Not set</p>
                        </div>
                    </div>
                    <div class="col-span-3 text-right">
                        <button id="subAccount2Pay" class="text-primary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-primary">Pay</button>
                        <button class="ml-4 text-primary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-primary">
                            Transactions
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-12 items-center gap-4 p-1 hover:bg-gray-700 rounded">
                    <div class="col-span-1 group w-10 h-10 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center hover:border-secondary" >
                  
                    </div>
                    <div class="col-span-11 flex-1 min-w-0">
                        <h3 class="font-medium text-gray-400 group-hover:text-secondary">Add New Sub Account</h3>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default SubAccounts;