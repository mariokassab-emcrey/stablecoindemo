import React, { useRef,useState,useEffect } from 'react';
import { Table,Modal, Button, Row, Col, Form } from "react-bootstrap";
import './App.css';
import { collection, getDocs,addDoc,deleteDoc,doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
function AccountBookDialog(props) {
  const dialogRef = useRef(null);
   const [Transactions, setTransactions] = useState([]);
 
  
useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const menuCollection = await getDocs(collection(db, "Transaction"));
      console.log("TransactionDateTime.seconds"+menuCollection.docs[0].data().TransactionDateTime)
      console.log("(new Date(doc.data().TransactionDateTime.seconds * 1000)).toLocaleString"+new Date(menuCollection.docs[0].data().TransactionDateTime.seconds * 1000))
      const fullMenu = menuCollection.docs.map((doc) => ({
        ID: doc.id,
        From: doc.data().From,
        Name: doc.data().Name,
        To: doc.data().To,
        Amount:  doc.data().Amount,
        TransactionDateTime : (new Date(doc.data().TransactionDateTime.seconds * 1000)).toString()
        
      }));
      console.log(fullMenu.length)
      setTransactions(fullMenu);
      
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  fetchTransactions();
}, []);

  return (
    <Table className="mt-4" striped bordered hover size="sm" style={{color:'white'}}>
              <thead>
                <tr>
                  <th className="th-home">From</th>
                  <th className="th-home">To</th>
                  <th className="th-home">Name</th>
                    <th className="th-home">Amount</th>
                <th className="th-home">Date Time</th>
                </tr>
              </thead>
              {Transactions.length !== 0 ? (
                <tbody>
                  {Transactions.map(
                    (transaction, index) => (
                      <tr key={index}>
                        <td className="td-home">
                          {transaction.From}
                        </td>
                        <td className="td-home">
                          {transaction.To}
                        </td>
                        <td className="td-home">
                          {transaction.Name}
                        </td> 
                          <td className="td-home">
                          {transaction.Amount}
                        </td> 
                        <td className="td-home">
                          {transaction.TransactionDateTime}
                          </td>    
                        
                      </tr>
                    )
                  )}
                </tbody>
              ) : (
                <tbody></tbody>
              )}
            </Table>
  );
}

export default AccountBookDialog;