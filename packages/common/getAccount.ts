import {
  Web3,
} from "web3";
import fs from "fs";


export const getAccount = (web3: Web3, name: string) => {
    try {
      const accountData = fs.readFileSync("eth_accounts/accounts.json", "utf8");
      const accountJson = JSON.parse(accountData);
      const accountPvtKey = accountJson[name]["pvtKey"];
  
      // Build an account object given private key
      web3.eth.accounts.wallet.add(accountPvtKey);
    } catch (error) {
      throw "Cannot read account";
    }
  };