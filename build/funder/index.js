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
const solc_lib_1 = require("../solc-lib");
const util_1 = require("../util");
const { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT, Contract } = require('web3');
let fs = require('fs');
const path = require('path');
/**
 * Init WebSocket provider
 * @return {Web3BaseProvider} Provider
 */
const initProvider = () => {
    try {
        const providerData = fs.readFileSync('eth_providers/providers.json', 'utf8');
        const providerJson = JSON.parse(providerData);
        //Enable one of the next 2 lines depending on Ganache CLI or GUI
        const providerLink = providerJson['provider_link_ui'];
        // const providerLink = providerJson['provider_link_cli']
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
/**
 * Request Escrow contract to release payment
 * @param {Web3} Web3 Web3 provider
 * @param {ABI} abi ABI of Escrow contract
 * @param {string} address Contract address
 */
const release = (web3, contract, from) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gasPrice = yield web3.eth.getGasPrice(ETH_DATA_FORMAT);
        const gasLimit = yield contract.methods.release().estimateGas({ from }, DEFAULT_RETURN_FORMAT);
        const tx = yield contract.methods.release().send({
            from,
            gasPrice,
            gas: util_1.GasHelper.gasPay(gasLimit)
        });
        console.log(`Requested to release payment.`);
    }
    catch (error) {
        console.error('Error while requesting to release payment');
        console.error(error);
    }
});
// Get command line arguments
const cmdArgs = process.argv.slice(2);
if (cmdArgs.length < 4) {
    console.error("node programName cmd, e.g. node build/index.js beneficiary oracle amount timeout");
    process.exit(1);
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const contractName = 'Escrow';
    const accountName = 'acc0';
    // Add 60 sec to make sure timeout isn't called too early due to clock errors
    const timeoutDelta = 30;
    let web3Provider;
    let web3;
    const buildPath = path.resolve(__dirname, '');
    let contractAddress;
    // Read command line arguments
    const beneficiary = cmdArgs[0];
    const oracle = cmdArgs[1];
    const value = Number(cmdArgs[2]) * Math.pow(10, 18); // Convert to Wei
    const timeout = cmdArgs[3];
    // Init Web3 provider
    try {
        web3Provider = initProvider();
        web3 = new Web3(web3Provider);
    }
    catch (error) {
        console.error(error);
        throw 'Web3 cannot be initialised.';
    }
    console.log('---- Funder ----\nConnected to Web3 provider.');
    // Create an account object using private key
    try {
        getAccount(web3, accountName);
    }
    catch (error) {
        console.error(error);
        throw 'Cannot access accounts';
    }
    const from = web3.eth.accounts.wallet[0].address;
    console.log(`Funder running as account ${accountName} with address ${from}`);
    // Compile contract and save it into a file for future use
    let compiledContract;
    try {
        compiledContract = (0, solc_lib_1.compileSols)([contractName]);
        (0, solc_lib_1.writeOutput)(compiledContract, buildPath);
    }
    catch (error) {
        console.error(error);
        throw 'Error while compiling contract';
    }
    console.log('Contract compiled');
    // Deploy contract
    const abi = compiledContract.contracts[contractName][contractName].abi;
    const contract = new web3.eth.Contract(compiledContract.contracts[contractName][contractName].abi);
    const data = compiledContract.contracts[contractName][contractName].evm.bytecode.object;
    const args = [beneficiary, oracle, timeout];
    // Deploy contract with given constructor arguments
    try {
        const contractToSend = contract.deploy({
            data,
            arguments: args
        });
        // Get current average gas price
        const gasPrice = yield web3.eth.getGasPrice(ETH_DATA_FORMAT);
        const gasLimit = yield contractToSend.estimateGas({ from }, DEFAULT_RETURN_FORMAT);
        const tx = yield contractToSend.send({
            from,
            value,
            gasPrice,
            gas: util_1.GasHelper.gasPay(gasLimit)
        });
        contractAddress = tx.options.address;
        console.log('Contract contract deployed at address: ' + contractAddress);
    }
    catch (error) {
        console.error(error);
        throw 'Error while deploying contract';
    }
    const contractInstance = new web3.eth.Contract(abi, contractAddress);
    // Request to release payment after the timeout. Run a local timer
    // that automatically calls release. Timeout should be in milliseconds
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const callReleaseAfter = (Number(timeout) - currentTime + timeoutDelta) * 1000;
    console.log(`Escrow timeout will be called in ${callReleaseAfter / 1000} seconds.`);
    setTimeout(release, callReleaseAfter, web3, contractInstance, from);
    // Listen to CheckDelivery event
    const subscriptionCheckDelivery = yield contractInstance.events.CheckDelivery();
    subscriptionCheckDelivery.on('data', (event) => {
        const funderAddress = event.returnValues.funder;
        const beneficiaryAddress = event.returnValues.beneficiary;
        console.log(`Event CheckDelivery received with funder ${funderAddress} and beneficiary: ${beneficiaryAddress}`);
    });
    subscriptionCheckDelivery.on('error', (err) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Error listening on CheckDelivery event.');
        console.error(err);
    }));
    // Listen to DeliveryStatus event
    const subscriptionDeliveryStatus = yield contractInstance.events.DeliveryStatus();
    subscriptionDeliveryStatus.on('data', (event) => {
        const deliveryStatus = event.returnValues.status;
        console.log(`Event DeliveryStatus received with status: ${deliveryStatus}`);
    });
    subscriptionDeliveryStatus.on('error', (err) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Error listening on DeliveryStatus event.');
        console.error(err);
    }));
    // Listen to TimeoutStatus event
    const subscriptionTimeoutStatus = yield contractInstance.events.TimeoutStatus();
    subscriptionTimeoutStatus.on('data', (event) => __awaiter(void 0, void 0, void 0, function* () {
        const timeoutStatus = event.returnValues.status;
        console.log(`Event TimeoutStatus received with time: ${timeoutStatus}`);
        if (timeoutStatus) {
            // Check my contract balance
            const balance = yield web3.eth.getBalance(from);
            const balanceWei = Number(balance) / Math.pow(10, 18);
            console.log(`Funder has a balance of ${balanceWei} ETH`);
        }
    }));
    subscriptionTimeoutStatus.on('error', (err) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Error listening on TimeoutStatus event.');
        console.error(err);
    }));
}))();
