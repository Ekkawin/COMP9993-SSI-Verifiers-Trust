const express = require('express')
const app = express()
const port = 3000

const {
  Web3,

} = require("web3");
import type { Web3BaseProvider, AbiStruct } from "web3-types";

import { deployContract, getAccount, initProvider } from "./helper";
let fs = require("fs");
const path = require("path");

app.post('/', (req:any, res:any) => {
  res.send('Hello World!')
})

app.listen(port, async () => {

  let web3Provider: Web3BaseProvider;
  let web3: typeof Web3;

  try {
    web3Provider = initProvider()
    web3 = new Web3(web3Provider);
  } catch (error) {
    console.error(error);
    throw "Web3 cannot be initialised.";
  }
  getAccount(web3, "acc0");

  const from = web3.eth.accounts.wallet[0].address;

  
  const graphAddress = await deployContract("Verifier", from, web3);
  console.log("Deploy Graph Smart Contract with Address", graphAddress);


  console.log("Add Factory Contract to Database");

  
  console.log(`Example app listening on port ${port}`)
})