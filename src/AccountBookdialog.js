import React, { useRef,useState,useEffect } from 'react';
import { Table,Modal, Button, Row, Col, Form } from "react-bootstrap";
import './App.css';
import { collection, getDocs,addDoc,deleteDoc,doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Check,Copy,Plus,SquareX,Trash2,X } from 'lucide-react';
function AccountBookDialog(props) {
  const dialogRef = useRef(null);
  const [AccountBook, setAccountBook] = useState([]);
  const [IsFormVisible,setIsFormVisible] = useState(["false"]);
  const [newName,setNewName] = useState('');

  const [newAddress,setNewAddress] = useState('');



  const openDialog = () => {
  
           
    dialogRef.current.showModal(); // Opens the dialog
  };

  const closeDialog = () => {
    dialogRef.current.close(); // Closes the dialog
  };
async function handleSubmit(event) {
  event.preventDefault();
  const newAccount = {
    
    Address: event.target.Address.value,
    Name: event.target.Name.value,
    
    MainAccount : props.mainAccount
  };
  try {
      

      await addDoc(collection(db, "Book"), newAccount);
      alert("Account Added successfully!");
      setIsFormVisible("false")
      // ✅ Redirect back to menu after successful order
      window.location.href = "/";
    } catch (error) {
      console.error("Error placing order: ", error);
      alert("Failed to place order.");
    }
  
  // setAccountBook([...AccountBook, newAccount]);

}

useEffect(() => {
    const fetchMenu = async () => {
      const menuCollection = await getDocs(collection(db, "Book"));
       console.log("menuCollection.docs"+menuCollection.docs[0].id)
      const Addresses = menuCollection.docs.map((doc) => ({
       ID:doc.id,
        Address: doc.data().Address,
        Amount: doc.data().Amount,
        Name: doc.data().Name,
        MainAccount:doc.data().MainAccount,
      }));
     
      setAccountBook(Addresses);
    };
    fetchMenu();
  }, []);

  return (
    <div>
      <button class="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" onClick={openDialog}>
        Address Book
      </button>
      <dialog ref={dialogRef}>
        <div class="container mx-auto px-4 py-2 bg-panel shadow-lg border border-customgray">

                            <div class="flex justify-between items-center mb-8">
                                <div class="flex items-center gap-4">
                                    <h1 class="text-3xl font-bold text-white">Accounts</h1>
                                </div>
                                <div class="text-right"> 
                                <SquareX class="text-gray-300 hover:text-secondary p-1 hover:bg-gray-700 transition-colors w-7 h-7" onClick={closeDialog} />
                                </div>
                             
                            </div>

                            <div class="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6">
                                <div class="flex justify-between items-center">
                                    <div class="flex gap-8">
                                       
                                        <Table className="mt-4" hover size="sm" style={{ color: 'white' }}>
                  <thead>
                    <tr>
                    </tr>
                  </thead>
                  {AccountBook.length !== 0
                    ? (
                      <tbody>
                        {AccountBook.map(
                          (account, index) => (
                            account.MainAccount === props.mainAccount ? 
                            <tr key={index}>
                              <td>
                                <div class="flex items-center gap-4 p-1 hover:bg-gray-700 rounded">
                                  <div class="w-10 h-10 rounded-full border-2 border-green-700 flex items-center justify-center" >
                                    <Check class="w-5 h-5 text-green-700 " />
                                  </div>
                                </div>
                              </td>

                              <td className="td-home">
                                <div class="flex flex-col">
                                  <p class="text-lg font-bold">{account.Name}</p>
                                  <div class="display: flex gap-1 text-gray-300">
                                    {props.truncateEthAddress(account.Address)}
                                    <button class="focus:outline-none" onClick={() => props.copyTextToClipboard(account.Address)} >
                                      <Copy size={12} />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              <td style={{ width: '200px' }}>
                                <Row class="flex" style={{ paddingLeft: '25px' }}>

                                  {props.allowPay === 'true' 
                                    ? (
                                        <button class="text-sm font-medium text-button px-3 py-1 rounded hover:bg-panel bg-gray-700 transition-colors border border-button focus:outline-none"
                                          onClick={() => {
                                            props.fillAccountDetails(account)
                                            closeDialog()
                                          }}>
                                          Pay
                                        </button>
                                    )
                                    :(<div/>)}

                                  <Trash2 class="flex ml-auto text-gray-300 hover:text-secondary p-1 rounded-full hover:bg-gray-700 transition-colors"
                                    onClick={async () => {
                                      await deleteDoc(doc(db, "Book", account.ID));
                                      setAccountBook(AccountBook.filter((item) => item.ID !== account.ID));
                                    }}>
                                  </Trash2>
                                  <div style={{ width: '10px', height: '10px' }}></div>
                                </Row>
                              </td>
                            </tr>:null
                          )
                        )}
                        <tr>
                          <td>
                            {IsFormVisible === "true" 
                            ? 
                              <div class="flex items-center gap-4 p-1 hover:bg-gray-700 rounded">
                                <button class="focus:outline-none" onClick={()=>console.info("NewName: ",newName)}>
                                  <div class="group w-10 h-10 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center hover:border-secondary">
                                    <Check class="w-5 h-5 text-green-700 group-hover:text-secondary" />
                                  </div>
                                </button>
                              </div>
                            : 
                              <div class="flex items-center gap-4 p-1 hover:bg-gray-700 rounded">
                                <button class="focus:outline-none" onClick={()=>setIsFormVisible("true")}>
                                  <div class="group w-10 h-10 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center hover:border-secondary">
                                    <Plus class="w-5 h-5 text-gray-500 group-hover:text-secondary" />
                                  </div>
                                </button>
                              </div>
                            }
                            
                          </td>
                          <td>
                            {IsFormVisible === 'true' 
                            ? 
                              <div class=" flex-1 min-w-0">
                                <div class="flex flex-col items-center py-1">
                                  <input type="text" id="newName" class="w-80 text-sm text-gray-300 bg-panel px-1 focus:outline-none"
                                    defaultValue="name" 
                                    onChange={(event)=>setNewName(event.target.value)}
                                    onFocus={()=>this.value=" "}
                                    ></input>
                                </div>
                                <div class="flex flex-col items-center py-1">
                                    {/*
                                    <input type="text" id="payReference" value="reference" onFocus="this.value=''" class="w-80 text-sm text-gray-300 bg-panel px-1 focus:outline-none"></input>
                                    */}
                                    <input type="text" id="newAddress" value="address" onChange={setNewAddress} class="w-80 text-sm text-gray-300 bg-panel px-1 focus:outline-none"></input>
                                </div>
                              </div>
                            : 
                              <div class=" flex-1 min-w-0">
                                <button onClick={()=>setIsFormVisible("true")}><h3 class="font-medium text-gray-400 group-hover:text-secondary" >Add New Address</h3></button>
                              </div>}   
                          </td>
                          <td>
                            {IsFormVisible === 'true' 
                            ? 
                            <button class="gap-4 focus:outline-none">
                              <div class="group w-10 h-10 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center hover:border-secondary" onClick={()=>setIsFormVisible("false")}>
                                <X class="w-5 h-5 text-red-700 group-hover:text-secondary" />
                              </div>
                            </button>
                            :
                            null}
                          </td>
                        </tr>

                      </tbody>
                    )
                    : (
                      <tbody></tbody>
                    )}
                </Table>
              </div>
          </div>
      </div>
    </div>
      </dialog>
    </div>
  );
}

export default AccountBookDialog;
