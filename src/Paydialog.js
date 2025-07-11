import React, { useRef, useState } from 'react';
import { Row, Col, Form } from "react-bootstrap";
import './App.css';
import * as ethers from "../node_modules/ethers/dist/ethers.min.js";
import AccountBookDialog from './AccountBookdialog.js';
import { collection, updateDoc, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { SquareX, Copy } from 'lucide-react';

function PayDialog(props) {

  const dialogRef = useRef(null);
  const [balance, setBalance] = useState(0);
  const [gasFees, setGasFees] = useState(0);
  const [Address, setAddress] = useState();
  const [Name, setName] = useState();
  const [Amount, setAmount] = useState();

  const openDialog = () => {
    if (balance === 0) {
      const element = document.getElementById("balanceSC")

      setBalance(element.innerText)
    } if (gasFees === 0) {
      const elementPay = document.getElementById("balanceETH")
      setGasFees(elementPay.innerText)
    }
    dialogRef.current.showModal(); // Opens the dialog
  };

  const closeDialog = () => {
    dialogRef.current.close(); // Closes the dialog
  };

  async function handleSubmit(event) {

    event.preventDefault()
    console.log("event" + event)
    console.log("handling submit")
    console.log("handling submit" + event.target.Address.value)
    const provider = new ethers.BrowserProvider(window.ethereum, 'sepolia');
    const signer = await provider.getSigner();
    const contractAddress = "0x78d5c26b106fac0b77f7cd7e864909c8ccf72ae0";
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
    const writeStablecoinContract = new ethers.Contract(contractAddress, erc20iAbi, signer);
    var valueDecimal18 = ethers.parseEther(event.target.Amount.value);
    //  writeStablecoinContract.transfer(event.target.Address.value,valueDecimal18).then((balance) => {});
    try {
      const tx = await writeStablecoinContract.transfer(event.target.Address.value, valueDecimal18);
      console.log(`Transaction hash: ${tx.hash}`);

      const receipt = await tx.wait();
      props.setStatus('Successful')
      const docref = await addTransaction('Successful');
      console.log("docref" + docref)
      console.log("docref.id" + docref.id)
      alert("Transaction successfully created");
      window.location.reload(false);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }

    async function updateTransaction(status, id) {
      try {
        const transaction = {
          From: props.account,
          Name: event.target.Reference.value,
          To: event.target.Address.value,
          Amount: event.target.Amount.value,

          TransactionDateTime: new Date(),
          Status: 'Success',
          Type: 'Pay'

        }
        console.log("id" + id)
        await updateDoc(id, transaction);
        alert("Transaction updated successfully!");

      } catch (error) {
        console.error("Error updating the transaction: ", error);
        alert("Failed to update the transaction.");
      }
    }

    async function addTransaction(status) {
      try {
        const transaction = {
          From: props.account,
          Name: event.target.Reference.value,
          To: event.target.Address.value,
          Amount: event.target.Amount.value,
          TransactionDateTime: new Date(),
          Status: status
        }
        return await addDoc(collection(db, "Transaction"), transaction);

      } catch (error) {
        console.error("Error Adding transaction: ", error);
        alert("Failed Add the transaction.");
      }
    }

  }

  return (
    <div>
      <button class="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" onClick={openDialog}>Pay</button>
      <dialog ref={dialogRef}>
        {/* <h2>Dialog Title</h2> */}
        <div class="container mx-auto px-4 py-2 bg-panel shadow-lg noBorder border-gray-700">

          {/* <!-- Title bar --> */}
          <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-4 text-right">
              <h1 class="text-3xl font-bold text-white">Pay</h1>
            </div>
            <div >
              <SquareX class="text-gray-300 hover:text-secondary p-1 hover:bg-gray-700 transition-colors w-7 h-7" onClick={closeDialog} />
            </div>
          </div>

          {/* <!-- Account Info Panel --> */}
          <div class="bg-card rounded-lg shadow-lg px-6 py-1 noBorder border-gray-700 mb-6">
            <div class="flex justify-between items-center">
              <div class="flex gap-8">

                <div class="self-center">
                  <h2 class="text-lg font-semibold text-white">Account</h2>
                  <div style={{ color: 'white' }} class="flex items-center gap-1 mt-1">
                    {props.truncateEthAddress(props.account)}
                    <button class="focus:outline-none" onClick={() => props.copyTextToClipboard(props.account)} >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
                <div style={{ color: 'white' }} class="self-center">
                  <h2 class="text-lg font-semibold text-white">Balance</h2>
                  {balance}
                </div>
                <div style={{ color: 'white' }} class="self-center">
                  <h3 class="text-base font-semibold text-white">Network Gas</h3>
                  {gasFees}
                </div>
              </div>
            </div>
          </div>


          <AccountBookDialog allowPay='true' mainAccount={props.account}
            truncateEthAddress={props.truncateEthAddress}
            copyTextToClipboard={props.copyTextToClipboard}
            fillAccountDetails={(account) => {
              setAddress(account.Address)
              setAmount(account.Amount)
              setName(account.Name)

            }}></AccountBookDialog>
          <Form style={{ color: 'white' }} onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group controlId="Address">
                  <Form.Label className="FormLabel">
                    Address<font COLOR="#ff0000">*</font>
                  </Form.Label>
                  <Form.Control
                    type="float"
                    name="Address"
                    value={Address}
                    required
                  ></Form.Control>
                </Form.Group>

              </Col>
              <Col> <Form.Group controlId="Amount">
                <Form.Label className="FormLabel">
                  Amount<font COLOR="#ff0000">*</font>
                </Form.Label>
                <Form.Control
                  type="float"
                  name="Amount"
                  value={Amount}
                  required
                ></Form.Control>
              </Form.Group>
              </Col>
              <Col><Form.Group controlId="Reference">
                <Form.Label className="FormLabel">Reference</Form.Label>
                <Form.Control
                  type="text"
                  value={Name}
                  name="Reference"
                ></Form.Control>
              </Form.Group>
              </Col>

            </Row>
            <br></br>
            <Row sm={2} >
              <Col lg='9'>
                <button class="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" formAction="/submitPay" type='submit'>
                  Make Payment
                </button>
              </Col>
            </Row>

          </Form>
        </div>
      </dialog>
    </div>
  );
}

export default PayDialog;