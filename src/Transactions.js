import React, { useRef,useState,useEffect } from 'react';
import { Table,Modal, Button, Row, Col, Form } from "react-bootstrap";
import './App.css';
import { collection, getDocs,addDoc,deleteDoc,doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Copy,ArrowDownRight,ArrowUpRight } from 'lucide-react';

function AccountBookDialog(props) {
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
    <Table selec className="noBorder" hover size="sm" style={{color:'white',border:'none'}}>
              {/* <thead>
                <tr>
                  <th className="th-home"></th>
                  <th className="th-home">From</th>
                  <th className="th-home">To</th>
                  <th className="th-home">Name</th>
                    <th className="th-home">Amount</th>
                <th className="th-home">Date Time</th>
                </tr>
              </thead> */}
              {Transactions.length !== 0 
              ? (
                <tbody className="noBorder">
                  {Transactions.map(
                    (transaction, index) => (
                      <tr className="noBorder" key={index}>
                        <td className="noBorder">
                          <div class="col-span-1 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            {
                            transaction.Type === 'Pay' 
                            ?  <ArrowDownRight class="w-5 h-5 text-red-400" size={24}/>
                            :  <ArrowUpRight class="w-5 h-5 text-green-400" size={24}></ArrowUpRight>
                            }
                          </div>  
                        </td>

                        <td className="noBorder">
                          <h2 class="text-lg font-bold display: flex gap-1" style={{onHover:{color:'black'}}}>{transaction.Name}</h2>
                          <div class="display: flex gap-1 text-gray-300">
                            {props.truncateEthAddress(transaction.From)}  
                            <button class="focus:outline-none" onClick={()=>props.copyTextToClipboard(transaction.From)} >
                              <Copy size={12}/>
                            </button>
                          </div>
                        </td>
                    
                        <td className="noBorder">
                          <h2>{transaction.TransactionDateTime.slice(0,15)}</h2>
                          <p>{transaction.TransactionDateTime.slice(15,25)}</p>
                        </td>    

                        <td className="noBorder">
                          <h2 class={transaction.Type === 'Pay' ? "text-red-400 font-medium font-mono text-right" : "text-green-400 font-medium font-mono text-right"}>{transaction.Amount}</h2>
                        </td>    
                    </tr>
                  ))}
                </tbody>
              ) 
              : ( 
                <tbody></tbody>
              )}
            </Table>
  );
}

export default AccountBookDialog;