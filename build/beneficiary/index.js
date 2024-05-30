"use strict";
/// SPDX-License-Identifier: UNLICENSED
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/// @title Interact with Escrow contract as beneficiary
/// @author Dilum Bandara, CSIRO's Data61
const util_1 = require("../util");
const { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } = require('web3');
let fs = require('fs');
/**
 * Init WebSocket provider
 * @return {Web3BaseProvider} Provider
 */
const initProvider = () => {
    try {
        const providerData = fs.readFileSync('eth_providers/providers.json', 'utf8');
        const providerJson = JSON.parse(providerData);
        //Enable one of the next 2 lines depending on Ganache CLI or GUI
        // const providerLink = providerJson['provider_link_ui']
        const providerLink = providerJson['provider_link_cli'];
        return new Web3.providers.WebsocketProvider(providerLink);
    }
    catch (error) {
        throw 'Cannot read provider';
    }
};
/**
 * Get an account given its name
 * @param {typeof Web3} Web3 Web3 provider
 * @param {string} name Account name
 */
const getAccount = (web3, name) => {
    try {
        const accountData = fs.readFileSync('eth_accounts/accounts.json', 'utf8');
        const accountJson = JSON.parse(accountData);
        const accountPvtKey = accountJson[name]['pvtKey'];
        // Build an account object given private key
        web3.eth.accounts.wallet.add(accountPvtKey);
    }
    catch (error) {
        throw 'Cannot read account';
    }
};
// Get command line arguments
const cmdArgs = process.argv.slice(2);
if (cmdArgs.length < 1) {
    console.error("node programName cmd, e.g. node build/index.js escrow");
    process.exit(1);
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const accountName = 'acc1';
    let web3Provider;
    let web3;
    // Read command line arguments
    const contractAddress = cmdArgs[0];
    // Init Web3 provider
    try {
        web3Provider = initProvider();
        web3 = new Web3(web3Provider);
    }
    catch (error) {
        console.error(error);
        throw 'Web3 cannot be initialised.';
    }
    console.log('---- Beneficiary ----\nConnected to Web3 provider.');
    // Create an account object using private key
    try {
        getAccount(web3, accountName);
    }
    catch (error) {
        console.error(error);
        throw 'Cannot access accounts';
    }
    const from = web3.eth.accounts.wallet[0].address;
    console.log(`Beneficiary running as account ${accountName} with address ${from}`);
    // Check escrow contract balance
    const balance = yield web3.eth.getBalance(contractAddress);
    const balanceWei = Number(balance) / Math.pow(10, 18);
    console.log(`Escrow contract at address ${contractAddress} has a balance of ${balanceWei} ETH`);
    // Check beneficiary address on escrow contract
    const jsonInterfaceBeneficiary = {
        name: 'beneficiary',
        type: 'function',
        inputs: []
    };
    const dataBeneficiary = web3.eth.abi.encodeFunctionCall(jsonInterfaceBeneficiary, []);
    try {
        const receiptBeneficiary = yield web3.eth.call({
            from,
            to: contractAddress,
            data: dataBeneficiary
        });
        console.log(`Beneficiary address on escrow: ${receiptBeneficiary}`);
    }
    catch (error) {
        console.error('Error while checking beneficiary address on escrow');
        console.error(error);
    }
    // Subscribe to CheckTimeout event
    const optionsCheckTimeout = {
        address: contractAddress,
        topics: [web3.utils.sha3('CheckTimeout(uint256)')]
    };
    const jsonInterfaceCheckTimeout = [{
            type: 'uint256',
            name: 'time'
        }];
    const subscriptionCheckTimeout = yield web3.eth.subscribe('logs', optionsCheckTimeout);
    subscriptionCheckTimeout.on('data', (event) => __awaiter(void 0, void 0, void 0, function* () {
        const eventData = web3.eth.abi.decodeLog(jsonInterfaceCheckTimeout, event.data, event.topics);
        console.log(`Event CheckTimeout received with timeout ${eventData.time}`);
    }));
    subscriptionCheckTimeout.on('error', (error) => __awaiter(void 0, void 0, void 0, function* () { return console.log('Error listening on event: ', error); }));
    // Subscribe to DeliveryStatus event
    const optionsDeliveryStatus = {
        address: contractAddress,
        topics: [web3.utils.sha3('DeliveryStatus(bool)')]
    };
    const jsonInterfaceStatus = [{
            type: 'bool',
            name: 'status'
        }];
    const subscriptionDeliveryStatus = yield web3.eth.subscribe('logs', optionsDeliveryStatus);
    subscriptionDeliveryStatus.on('data', (event) => __awaiter(void 0, void 0, void 0, function* () {
        const eventData = web3.eth.abi.decodeLog(jsonInterfaceStatus, event.data, event.topics);
        console.log(`Event DeliveryStatus received with status ${eventData.status}`);
        if (eventData.status) {
            // Check my contract balance
            const balance = yield web3.eth.getBalance(from);
            const balanceWei = Number(balance) / Math.pow(10, 18);
            console.log(`Beneficiary has a balance of ${balanceWei} ETH`);
        }
    }));
    subscriptionDeliveryStatus.on('error', (err) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Error listening on event.');
        console.error(err);
    }));
    // Subscribe to TimeoutStatus event
    const optionsTimeoutStatus = {
        address: contractAddress,
        topics: [web3.utils.sha3('TimeoutStatus(bool)')]
    };
    const subscriptionTimeoutStatus = yield web3.eth.subscribe('logs', optionsTimeoutStatus);
    subscriptionTimeoutStatus.on('data', (event) => {
        const eventData = web3.eth.abi.decodeLog(jsonInterfaceStatus, event.data, event.topics);
        console.log(`Event TimeoutStatus received with status ${eventData.status}`);
    });
    subscriptionTimeoutStatus.on('error', (err) => {
        console.log('Error listening on event.');
        console.error(err);
    });
    // Request to redeem funds from escrow
    const jsonInterfaceRedeem = {
        "inputs": [],
        "name": "redeem",
        "outputs": [],
        "type": "function"
    };
    const dataRedeem = web3.eth.abi.encodeFunctionCall(jsonInterfaceRedeem, []);
    try {
        const gasPrice = yield web3.eth.getGasPrice(ETH_DATA_FORMAT);
        const gasLimit = yield web3.eth.estimateGas({
            from,
            to: contractAddress,
            data: dataRedeem
        });
        const tx = yield web3.eth.sendTransaction({
            from,
            to: contractAddress,
            data: dataRedeem,
            gasPrice,
            gas: util_1.GasHelper.gasPay(gasLimit)
        });
        console.log(`Requested to redeem funds.`);
    }
    catch (error) {
        console.error('Error while calling redeem.');
        console.error(error);
    }
}))();