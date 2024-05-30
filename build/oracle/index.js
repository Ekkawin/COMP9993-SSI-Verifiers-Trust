"use strict";
/// SPDX-License-Identifier: UNLICENSED
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/// @title Interact with Escrow contract as oracle
/// @author Dilum Bandara, CSIRO's Data61
const util_1 = require("../util");
const { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } = require('web3');
const axios = require('axios').default;
let fs = require('fs');
const readline = __importStar(require("node:readline"));
const node_process_1 = require("node:process");
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
// Get command line arguments
const cmdArgs = process.argv.slice(2);
if (cmdArgs.length < 1) {
    console.error("node programName cmd, e.g. node build/index.js escrow");
    process.exit(1);
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const accountName = 'acc2';
    // const buildPath = path.resolve(__dirname, '')
    const country = 'Australia';
    const city = 'Sydney';
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
    console.log('---- Oracle ----\nConnected to Web3 provider.');
    // Create an account object using private key
    try {
        getAccount(web3, accountName);
    }
    catch (error) {
        console.error(error);
        throw 'Cannot access accounts';
    }
    const from = web3.eth.accounts.wallet[0].address;
    console.log(`Oracle running as account ${accountName} with address ${from}`);
    // Subscribe to events from Escrow contract
    // Subscribe to CheckDelivery event
    const optionsCheckDelivery = {
        address: contractAddress,
        topics: [web3.utils.sha3('CheckDelivery(address,address)')]
    };
    const jsonInterfaceCheckDelivery = [{
            type: 'address',
            name: 'funder'
        }, {
            type: 'address',
            name: 'beneficiary'
        }];
    const subscriptionCheckDelivery = yield web3.eth.subscribe('logs', optionsCheckDelivery);
    subscriptionCheckDelivery.on('data', (event) => __awaiter(void 0, void 0, void 0, function* () {
        const eventData = web3.eth.abi.decodeLog(jsonInterfaceCheckDelivery, event.data, event.topics);
        console.log(`Event CheckDelivery received with funder ${eventData.funder} and beneficiary: ${eventData.beneficiary}`);
        const rl = readline.createInterface({
            input: node_process_1.stdin,
            output: node_process_1.stdout,
            prompt: 'Is the asset delivered?'
        });
        rl.prompt();
        rl.on('line', (line) => __awaiter(void 0, void 0, void 0, function* () {
            let deliveryStatus;
            switch (line.trim()) {
                case 'yes':
                case 'Yes':
                    deliveryStatus = true;
                    break;
                default:
                    deliveryStatus = false;
                    break;
            }
            const jsonInterfaceDeliveryStatus = {
                name: 'deliveryStatus',
                type: 'function',
                inputs: [{
                        type: 'bool',
                        name: 'isDelivered'
                    }]
            };
            const dataDeliveryStatus = web3.eth.abi.encodeFunctionCall(jsonInterfaceDeliveryStatus, [deliveryStatus]);
            try {
                const gasPrice = yield web3.eth.getGasPrice(ETH_DATA_FORMAT);
                const gasLimit = yield web3.eth.estimateGas({
                    from,
                    to: contractAddress,
                    data: dataDeliveryStatus
                });
                const tx = yield web3.eth.sendTransaction({
                    from,
                    to: contractAddress,
                    data: dataDeliveryStatus,
                    gasPrice,
                    gas: util_1.GasHelper.gasPay(gasLimit)
                });
                console.log(`Submitted delivery status as ${deliveryStatus}`);
            }
            catch (error) {
                console.error('Error while calling deliveryStatus.');
                console.error(error);
            }
        }));
    }));
    subscriptionCheckDelivery.on('error', (error) => __awaiter(void 0, void 0, void 0, function* () { return console.log('Error when subscribing to CheckDelivery event: ', error); }));
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
        // Get current time from 3rd party API
        const url = `http://worldtimeapi.org/api/timezone/${country}/${city}`;
        try {
            const response = yield axios.get(url);
            let timeoutStatus;
            if (response.data.unixtime > eventData.time)
                timeoutStatus = true;
            else
                timeoutStatus = false;
            const jsonInterfaceTimeoutStatus = {
                name: 'timeoutStatus',
                type: 'function',
                inputs: [{
                        type: 'bool',
                        name: 'isTimeout'
                    }]
            };
            const dataTimeoutStatus = web3.eth.abi.encodeFunctionCall(jsonInterfaceTimeoutStatus, [timeoutStatus]);
            try {
                const gasPrice = yield web3.eth.getGasPrice(ETH_DATA_FORMAT);
                const gasLimit = yield web3.eth.estimateGas({
                    from,
                    to: contractAddress,
                    data: dataTimeoutStatus
                });
                const tx = yield web3.eth.sendTransaction({
                    from,
                    to: contractAddress,
                    data: dataTimeoutStatus,
                    gasPrice,
                    gas: util_1.GasHelper.gasPay(gasLimit)
                });
                console.log(`Submitted timeout status as ${timeoutStatus}`);
            }
            catch (error) {
                console.error('Error while calling timeoutStatus.');
                console.error(error);
            }
        }
        catch (error) {
            console.error(error);
        }
    }));
    subscriptionCheckTimeout.on('error', (error) => __awaiter(void 0, void 0, void 0, function* () { return console.log('Error listening on event: ', error); }));
}))();
