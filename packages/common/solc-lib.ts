/// SPDX-License-Identifier: UNLICENSED
/// @title Compile contracts
/// @author Dilum Bandara, CSIRO's Data61

import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import path from 'path';
const solc = require('solc')


const findImports = (_path: string): any => {
    try {
        const buildPath = path.resolve(__dirname, "../contracts");
        return {
            
            contents: fs.readFileSync(`${buildPath}/${_path}`, 'utf8')
        }
    } catch (e: any) {
        return {
            error: e.message
        }
    }
}

/**
 * Writes contracts from the compiled sources into JSON files
 * @param {any} compiled Object containing the compiled contracts
 * @param {string} buildPath Path of the build folder
 */
export const writeOutput = (compiled: any, buildPath: string) => {
    fsExtra.ensureDirSync(buildPath)    // Make sure directory exists

    for (let contractFileName in compiled.contracts) {
        const contractName = contractFileName.replace('.sol', '')
        console.log('Writing: ', contractName + '.json to ' + buildPath)
        fsExtra.outputJsonSync(
            path.resolve(buildPath, contractName + '.json'),
            compiled.contracts
        )
    }
}

/**
 * Compile Solidity contracts
 * @param {Array<string>} names List of contract names
 * @return An object with compiled contracts
 */
export const compileSols = (names: string[]): any => {
    // Collection of Solidity source files
    interface SolSourceCollection {
        [key: string]: any
    }

    let sources: SolSourceCollection = {}

    names.forEach((value: string, index: number, array: string[]) => {
        const buildPath = path.resolve(__dirname, "../contracts");
        let file = fs.readFileSync(`${buildPath}/${value}.sol`, 'utf8')
        // console.log("file", file)
        sources[value] = {
            content: file
        }
    })

    console.log("names", names)

    let input = {
        language: 'Solidity',
        sources,
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            },
            evmVersion: 'berlin' //Uncomment this line if using Ganache GUI
        }
    }

    // Compile all contracts
    try {
        return JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }))
    } catch (error) {
        console.log(error);
    }
}
