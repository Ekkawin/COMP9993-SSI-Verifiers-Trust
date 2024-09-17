/// SPDX-License-Identifier: UNLICENSED

/// @title Deploy and interact with Escrow contract
/// @author Dilum Bandara, CSIRO's Data61

import { time } from 'node:console'
import { compileSols, writeOutput } from '../solc-lib'
import { GasHelper } from '../util'
const { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT, Contract } = require('web3')
import type { Web3BaseProvider, AbiStruct } from 'web3-types'
let fs = require('fs')
const path = require('path')

/**
 * Init WebSocket provider
 * @return {Web3BaseProvider} Provider
 */
const initProvider = (): Web3BaseProvider => {
    try {
        const providerData = fs.readFileSync('eth_providers/providers.json', 'utf8')
        const providerJson = JSON.parse(providerData)

        //Enable one of the next 2 lines depending on Ganache CLI or GUI
        const providerLink = providerJson['provider_link_ui']
        // const providerLink = providerJson['provider_link_cli']

        return new Web3.providers.WebsocketProvider(providerLink)
    } catch (error) {
        throw 'Cannot read provider'
    }
}

/**
 * Get an account given its name
 * @param {typeof Web3} Web3 Web3 provider
 * @param {string} name Account name 
 */
const getAccount = (web3: typeof Web3, name: string) => {
    try {
        const accountData = fs.readFileSync('eth_accounts/accounts.json', 'utf8')
        const accountJson = JSON.parse(accountData)
        const accountPvtKey = accountJson[name]['pvtKey']

        // Build an account object given private key
        web3.eth.accounts.wallet.add(accountPvtKey)
    } catch (error) {
        throw 'Cannot read account'
    }
}

/**
 * Request Escrow contract to release payment
 * @param {Web3} Web3 Web3 provider
 * @param {ABI} abi ABI of Escrow contract
 * @param {string} address Contract address
 */
const release = async (web3: typeof Web3, contract: typeof Contract, from: string) => {
    try {
        const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT)
        const gasLimit = await contract.methods.release().estimateGas(
            { from },
            DEFAULT_RETURN_FORMAT, // the returned data will be formatted as a bigint
        )
        const tx = await contract.methods.release().send({
            from,
            gasPrice,
            gas: GasHelper.gasPay(gasLimit)
        })
        console.log(`Requested to release payment.`)
    } catch (error) {
        console.error('Error while requesting to release payment')
        console.error(error)
    }
}

// Get command line arguments
const cmdArgs = process.argv.slice(2)
if (cmdArgs.length < 4) {
    console.error("node programName cmd, e.g. node build/index.js beneficiary oracle amount timeout")
    process.exit(1)
}

(async () => {
    const contractName = 'Escrow'
    const accountName = 'acc0'
    // Add 60 sec to make sure timeout isn't called too early due to clock errors
    const timeoutDelta = 30

    let web3Provider: Web3BaseProvider
    let web3: typeof Web3
    const buildPath = path.resolve(__dirname, '')
    let contractAddress: string

    // Read command line arguments
    const beneficiary = cmdArgs[0]
    const oracle = cmdArgs[1]
    const value = Number(cmdArgs[2]) * Math.pow(10, 18) // Convert to Wei
    const timeout = cmdArgs[3]

    // Init Web3 provider
    try {
        web3Provider = initProvider()
        web3 = new Web3(web3Provider)
    } catch (error) {
        console.error(error)
        throw 'Web3 cannot be initialised.'
    }
    console.log('---- Funder ----\nConnected to Web3 provider.')

    // Create an account object using private key
    try {
        getAccount(web3, accountName)
    } catch (error) {
        console.error(error)
        throw 'Cannot access accounts'
    }
    const from = web3.eth.accounts.wallet[0].address
    console.log(`Funder running as account ${accountName} with address ${from}`)

    // Compile contract and save it into a file for future use
    let compiledContract: any
    try {
        compiledContract = compileSols([contractName])
        writeOutput(compiledContract, buildPath)
    } catch (error) {
        console.error(error)
        throw 'Error while compiling contract'
    }
    console.log('Contract compiled')

    // Deploy contract
    const abi = compiledContract.contracts[contractName][contractName].abi
    const contract = new web3.eth.Contract(compiledContract.contracts[contractName][contractName].abi)
    const data = compiledContract.contracts[contractName][contractName].evm.bytecode.object
    const args = [beneficiary, oracle, timeout]

    // Deploy contract with given constructor arguments
    try {
        const contractToSend = contract.deploy({
            data,
            arguments: args
        })

        // Get current average gas price
        const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT)
        const gasLimit = await contractToSend.estimateGas(
            { from },
            DEFAULT_RETURN_FORMAT, // the returned data will be formatted as a bigint   
        )
        const tx = await contractToSend.send({
            from,
            value,
            gasPrice,
            gas: GasHelper.gasPay(gasLimit)
        })
        contractAddress = tx.options.address
        console.log('Contract contract deployed at address: ' + contractAddress)
    } catch (error) {
        console.error(error)
        throw 'Error while deploying contract'
    }

    const contractInstance = new web3.eth.Contract(abi, contractAddress)

    // Request to release payment after the timeout. Run a local timer
    // that automatically calls release. Timeout should be in milliseconds
    const currentTime = Math.floor(new Date().getTime() / 1000)
    const callReleaseAfter = (Number(timeout) - currentTime + timeoutDelta) * 1000
    console.log(`Escrow timeout will be called in ${callReleaseAfter / 1000} seconds.`)
    setTimeout(release, callReleaseAfter, web3, contractInstance, from)

    // Listen to CheckDelivery event
    const subscriptionCheckDelivery = await contractInstance.events.CheckDelivery()
    subscriptionCheckDelivery.on('data', (event: any) => {
        const funderAddress = event.returnValues.funder
        const beneficiaryAddress = event.returnValues.beneficiary
        console.log(`Event CheckDelivery received with funder ${funderAddress} and beneficiary: ${beneficiaryAddress}`)
    })
    subscriptionCheckDelivery.on('error', async (err: any) => {
        console.log('Error listening on CheckDelivery event.')
        console.error(err)
    })

    // Listen to DeliveryStatus event
    const subscriptionDeliveryStatus = await contractInstance.events.DeliveryStatus()
    subscriptionDeliveryStatus.on('data', (event: any) => {
        const deliveryStatus = event.returnValues.status
        console.log(`Event DeliveryStatus received with status: ${deliveryStatus}`)
    })
    subscriptionDeliveryStatus.on('error', async (err: any) => {
        console.log('Error listening on DeliveryStatus event.')
        console.error(err)
    })

    // Listen to TimeoutStatus event
    const subscriptionTimeoutStatus = await contractInstance.events.TimeoutStatus()
    subscriptionTimeoutStatus.on('data', async (event: any) => {
        const timeoutStatus = event.returnValues.status
        console.log(`Event TimeoutStatus received with time: ${timeoutStatus}`)
        if (timeoutStatus) {
            // Check my contract balance
            const balance = await web3.eth.getBalance(from)
            const balanceWei = Number(balance) / Math.pow(10, 18)
            console.log(`Funder has a balance of ${balanceWei} ETH`)
        }
    })
    subscriptionTimeoutStatus.on('error', async (err: any) => {
        console.log('Error listening on TimeoutStatus event.')
        console.error(err)
    })

})()
