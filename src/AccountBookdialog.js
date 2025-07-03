import React, { useRef,useState,useEffect } from 'react';
import { Table,Modal, Button, Row, Col, Form } from "react-bootstrap";
import './App.css';
import { collection, getDocs,addDoc,deleteDoc,doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Check,Copy,Plus,SquareX,Trash2 } from 'lucide-react';
function AccountBookDialog(props) {
  const dialogRef = useRef(null);
  const [AccountBook, setAccountBook] = useState([]);
 
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
      alert("Order placed successfully!");
      
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
        <div class="container mx-auto px-4 py-2 bg-panel shadow-lg border border-gray-700">

                            <div class="flex justify-between items-center mb-8">
                                <div class="flex items-center gap-4">
                                    <h1 class="text-3xl font-bold text-white">Accounts</h1>
                                </div>
                                <div class="text-right"> 
                                <SquareX class="text-gray-300 hover:text-secondary p-1 hover:bg-gray-700 transition-colors w-7 h-7" onClick={closeDialog} />
                                </div>
                             
                            </div>

                            <div class="bg-card rounded-lg shadow-lg px-6 py-1 border border-gray-700 mb-6">
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
                            <tr key={index}>
                              <td>
                                <div class="flex items-center gap-4 p-1 hover:bg-gray-700 rounded">
                                  <div class="w-10 h-10 rounded-full border-2 border-green-700 flex items-center justify-center" onclick="">
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
                                <Row style={{ paddingLeft: '25px' }}>

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

                                  <div style={{ width: '10px', height: '10px' }}></div>
                                  <Trash2 class="text-gray-300 hover:text-secondary p-1 rounded-full hover:bg-gray-700 transition-colors"
                                    onClick={async () => {
                                      await deleteDoc(doc(db, "Book", account.ID));
                                      setAccountBook(AccountBook.filter((item) => item.ID !== account.ID));
                                    }}>
                                  </Trash2>
                                </Row>
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td>
                            <div class="flex items-center gap-4 p-1 hover:bg-gray-700 rounded">
                              <div class="group w-10 h-10 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center hover:border-secondary" onclick="">
                                <Plus class="w-5 h-5 text-gray-500 group-hover:text-secondary" />
                              </div>
                            </div>
                          </td>
                          <td>
                            <div class=" flex-1 min-w-0">
                              <h3 class="font-medium text-gray-400 group-hover:text-secondary">Add New Address</h3>
                            </div>
                          </td>
                          <td></td>
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

                            
                                          
                                          <Form style={{color : 'white'}} onSubmit={handleSubmit}>
                                            <Row>
                                                <Col>
                                                <Form.Group controlId="Address">
                <Form.Label className="FormLabel">
                  Address<font COLOR="#ff0000">*</font>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="Address"
                  required
                 
                ></Form.Control>
              </Form.Group>
                                               
                                                </Col>
                                                <Col><Form.Group controlId="Name">
                <Form.Label className="FormLabel">Name <font COLOR="#ff0000">*</font></Form.Label>
                <Form.Control
                  type="text"
                 required
                //   defaultValue={this.props.AssignmentTopic}
                //   dir="RTL"
                  name="Name"
                ></Form.Control>
              </Form.Group>
                                                </Col>
                                                {/* <Col> <Form.Group controlId="Amount">
                <Form.Label className="FormLabel">
                  Amount
                </Form.Label>
                <Form.Control
                  type="float"
                  name="Amount"
                  
                 
                ></Form.Control>
              </Form.Group>
                                                </Col> */}
                                                <Col><Button style={{marginTop: '33px'}} id="AccountBookDialogPayBtn"  class="text-secondary hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-secondary" formAction="submitBook" type='submit' >
                                        <Plus/>
                                    </Button></Col>
                                            </Row>
                                            <br></br>
                                            <Row sm={2} >
                                    {/* <Col lg='9'>
                                    
                                    </Col> */}
                                {/* </div> */}
                            {/* </div> */}
                            
                       </Row>
                                          </Form>
                                          </div>
            
                                    
       
      </dialog>
    </div>
  );
}

export default AccountBookDialog;