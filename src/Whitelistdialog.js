import React, { useRef,useState,useEffect } from 'react';
import { Table,Modal, Button, Row, Col, Form } from "react-bootstrap";
import './App.css';
import { collection, getDocs,addDoc,deleteDoc,doc,updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Check,Copy,Plus,SquareX,Trash2,X,EditIcon } from 'lucide-react';
import { ethers } from 'ethers';
import contractAbi from './ABI.json';
function WhitelistDialog(props) {
  const dialogRef = useRef(null);
  const [Whitelist, setWhitelist] = useState([]);
  const [IsFormVisible,setIsFormVisible] = useState(["false"]);
  const [canReceiveFlags,setCanReceiveFlags] = useState([""]);
 const [IsUpdate,setIsUpdate] = useState(["false"]);
 const [Address,setAddress] = useState([""]);
 const [canSendFlags,setCanSendFlags] = useState([""]);
 const [isBlacklistedFlags,setIsBlacklistedFlags] = useState([""]);
 

  const openDialog = () => {
  
           
    dialogRef.current.showModal(); // Opens the dialog
  };

  const closeDialog = () => {
    dialogRef.current.close(); // Closes the dialog
  };
async function handleSubmit(event) {
  event.preventDefault();
  console.log("isupdate"+IsUpdate)
  const newAccount = {
    
    Address: event.target.Address.value,
    Name: event.target.Name.value,
    
  };
  if(IsUpdate==="true"){
    
    //call marie on update
     const contractAddress = '0x715df9a13088ef923120f3355aa27441f9155614';
  // const provider = new ethers.JsonRpcProvider('https://fluent-chaotic-lake.ethereum-sepolia.quiknode.pro/b989ab5dc846e9bfab7637b37a5b36f0bcd11fb5/');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  let flag = 0x00001;
  if(event.target.isBlacklistedFlags.value)
    flag = 0x00004;
  else{
    if(event.target.canReceiveFlags.value)
       flag = 0x00002;
      else{
        if(event.target.canSendFlags.value){
          flag = 0x00003;
        }
      }
  }

  const tx = await contract.addPermission(event.target.Address.value,flag);
  // try {
  //   console.log("CurrentID"+CurrentID)
  //   const docRef = doc(db, "Whitelist", CurrentID);
  // await updateDoc(docRef, newAccount);
  //      await fetchMenu()
  //      setIsUpdate("false")
  //      setIsFormVisible("false")
  //      alert("List Updated successfully")
  // }catch (error) {
  //     console.error("Error Updating: ", error);
  //     alert("Failed Update the Whitelist.");
  //   }
  }
  else{
  
  try {
      {
      try {
        const contractAddress = '0x715df9a13088ef923120f3355aa27441f9155614';
  // const provider = new ethers.JsonRpcProvider('https://fluent-chaotic-lake.ethereum-sepolia.quiknode.pro/b989ab5dc846e9bfab7637b37a5b36f0bcd11fb5/');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  const tx = await contract.setPermissions(event.target.Address.value,event.target.Name.value);
        // const result = await contract.setPermissions(event.target.Address.value,event.target.Name.value);
        // console.log("result"+result);
      } catch (error) {
        console.error('Error calling contract function:', error);
      }
    }

      await addDoc(collection(db, "Whitelist"), newAccount);
       await fetchMenu()
      // alert("Account Added successfully!");
      setIsFormVisible("false")
      // ✅ Redirect back to menu after successful order
   
                                     
                                     
                                  
    } catch (error) {
      console.error("Error adding to the list: ", error);
      alert("Failed to Add to the whitelist.");
    }
  }
  // setWhitelist([...Whitelist, newAccount]);

}
 const fetchMenu = async () => {
  const contractAddress = '0x715df9a13088ef923120f3355aa27441f9155614';
  // const provider = new ethers.JsonRpcProvider('https://fluent-chaotic-lake.ethereum-sepolia.quiknode.pro/b989ab5dc846e9bfab7637b37a5b36f0bcd11fb5/');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  const menuCollection = await contract.getWhitelistedWithPermissions();
  console.log("menuCollection"+menuCollection)
    console.log("menuCollection0"+menuCollection[0])
    console.log("menuCollection1"+menuCollection[1])
    console.log("menuCollection2"+menuCollection[2])
    console.log("menuCollection3"+menuCollection[3])
      // const menuCollection = await getDocs(collection(db, "Whitelist"));
      //  console.log("menuCollection.docs"+menuCollection.docs[0].id)
    // const Addresses  {
      
    //     Address: menuCollection[0],
    //     canSendFlags: menuCollection.[1],
    //     canReceiveFlags:menuCollection.[2],
    //     isBlacklistedFlags:menuCollection.[3],
    //   }
      const Addresses = () => ({
      
        Address: menuCollection[0],
        canSendFlags: menuCollection[1],
        canReceiveFlags:menuCollection[2],
        isBlacklistedFlags:menuCollection[3],
      });
     const whitelistAddresses = menuCollection[0].map((collection,index)=>(
      {
        Address:collection,
        canSendFlags:menuCollection[1][index],
        canReceiveFlags:menuCollection[2][index],
        isBlacklistedFlags:menuCollection[3][index],
      }
     ))
     console.log("whitelistAddresses"+whitelistAddresses[2].canReceiveFlags)
      setWhitelist(whitelistAddresses);
    };
useEffect(() => {
   
    fetchMenu();
  }, []);

  return (
    <div>
      <button class="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" onClick={openDialog}>
        WhiteList
      </button>
      <dialog ref={dialogRef}>
        <div class="container mx-auto px-4 py-2 bg-panel shadow-lg border border-gray-700">

                            <div class="flex justify-between items-center mb-8">
                                <div class="flex items-center gap-4">
                                    <h1 class="text-3xl font-bold text-white">WhiteList Accounts</h1>
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
                      <td></td>
                       <td>
                                
                                   Address
                               
                              </td>
                               <td>
                              
                                   Send
                               
                              </td>
                               <td>
                             Recieve
                                   
                                 
                              </td>
                               <td>
                              BlackListed
                                   
                                
                              </td>
                              
                    </tr>
                  </thead>
                  {Whitelist.length !== 0
                    ? (
                      <tbody>
                        {Whitelist.map(
                          (account, index) => (
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
                                  <p class="text-lg font-bold">{props.truncateEthAddress(account.Address)}</p>
                                  <div class="display: flex gap-1 text-gray-300">
                                  </div>
                                </div>
                              </td>
                              <td className="td-home">
                                <div class="flex flex-col">
                                  <p class="text-lg font-bold">{account.canSendFlags.toString()}</p>
                                  <div class="display: flex gap-1 text-gray-300">
                                  </div>
                                </div>
                              </td>
                              
                               <td className="td-home">
                                <div class="flex flex-col">
                                  <p class="text-lg font-bold">{account.canReceiveFlags.toString()}</p>
                                  <div class="display: flex gap-1 text-gray-300">
                                    
                                  </div>
                                </div>
                              </td>
                               
 <td className="td-home">
                                <div class="flex flex-col">
                                  <p class="text-lg font-bold">{account.isBlacklistedFlags.toString()}</p>
                                  <div class="display: flex gap-1 text-gray-300">
                                   
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
                                  {/* <Trash2 class="text-gray-300 hover:text-secondary p-1 rounded-full hover:bg-gray-700 transition-colors"
                                    onClick={async () => {
                                      await deleteDoc(doc(db, "Whitelist", account.ID));
                                      setWhitelist(Whitelist.filter((item) => item.ID !== account.ID));
                                    }}>
                                  </Trash2> */}
                                  <EditIcon class="text-gray-300 hover:text-secondary p-1 rounded-full hover:bg-gray-700 transition-colors"
                                   onClick={ () => {setIsUpdate("true")
                                    setIsFormVisible("true")
                                    setAddress(account.Address)
                                    setCanSendFlags(account.canSendFlags)
                                    setCanReceiveFlags(account.canReceiveFlags)
                                    setIsBlacklistedFlags(account.isBlacklistedFlags)
                                    
                                    
                                     
                                    }}>

                                  </EditIcon>
                                </Row>
                              </td>
                            </tr>
                          )
                        )}
                        <tr>
                          <td>
                            {IsFormVisible === "true" ? null : <div class="flex items-center gap-4 p-1 hover:bg-gray-700 rounded">
                              <div class="group w-10 h-10 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center hover:border-secondary" >
                               <button> <Plus onClick={()=>{setIsFormVisible("true");setIsUpdate('false'); setAddress('');setCanReceiveFlags('');setCanSendFlags('');setIsBlacklistedFlags('')}} class="w-5 h-5 text-gray-500 group-hover:text-secondary" /></button>
                              </div>
                            </div>}
                            
                          </td>
                          <td>
                            {IsFormVisible === 'true' ? <Form style={{color : 'white'}} onSubmit={handleSubmit}>
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
                  defaultValue={Address}
                 
                ></Form.Control>
              </Form.Group>
                                               
                                                </Col>
                                                <Col><Form.Group controlId="canSendFlags">
                <Form.Label className="FormLabel">canSendFlags <font COLOR="#ff0000">*</font></Form.Label>
                <Form.Control
                  type="text"
                 required
                 defaultValue={canSendFlags}
                //   defaultValue={this.props.AssignmentTopic}
                //   dir="RTL"
                  name="Name"
                ></Form.Control>
              </Form.Group>
                                                </Col>
                                                <Col><Form.Group controlId="canReceiveFlags">
                <Form.Label className="FormLabel">canReceiveFlags <font COLOR="#ff0000">*</font></Form.Label>
                <Form.Control
                  type="text"
                 required
                 defaultValue={canReceiveFlags}
                //   defaultValue={this.props.AssignmentTopic}
                //   dir="RTL"
                  name="Name"
                ></Form.Control>
              </Form.Group>
                                                </Col>
                                                <Col><Form.Group controlId="isBlacklistedFlags">
                <Form.Label className="FormLabel">isBlacklistedFlags <font COLOR="#ff0000">*</font></Form.Label>
                <Form.Control
                  type="text"
                 required
                 defaultValue={isBlacklistedFlags}
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
                                                <Col sm="2"><Button style={{marginTop: '33px'}} id="WhitelistDialogPayBtn"  class="text-button hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button" formAction="submitBook" type='submit' >
                                        <Plus/>
                                    </Button></Col>
                                    <Col sm="2"><Button style={{marginTop: '33px'}} id="WhitelistDialogXCancelBtn"  class="text-button hover:text-white text-sm font-medium px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button" onClick={()=>setIsFormVisible("false")} >
                                        <X/>
                                    </Button></Col>
                                            </Row>
                                            <br></br>
                                            <Row sm={2} >
                                    {/* <Col lg='9'>
                                    
                                    </Col> */}
                                {/* </div> */}
                            {/* </div> */}
                            
                       </Row>
                                          </Form> : <div class=" flex-1 min-w-0">
                              <button onClick={()=>{setIsFormVisible("true");setIsUpdate('false'); setAddress('');setCanReceiveFlags('');setCanSendFlags('');setIsBlacklistedFlags('')}}><h3 class="font-medium text-gray-400 group-hover:text-secondary" >Add New Address</h3></button>
                            </div> }     
                            
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

                            
                                          
                                     
                                          </div>
            
                                    
       
      </dialog>
    </div>
  );
}

export default WhitelistDialog;
