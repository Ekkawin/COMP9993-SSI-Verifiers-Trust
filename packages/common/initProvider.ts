import {
  Web3
} from "web3";
import type { Web3BaseProvider, AbiStruct } from "web3-types";
import fs from "fs";

export const initProvider = (): Web3BaseProvider => {
    try {
      const providerData = fs.readFileSync(
        "eth_providers/providers.json",
        "utf8"
      );
      const providerJson = JSON.parse(providerData);
  
      //Enable one of the next 2 lines depending on Ganache CLI or GUI
      const providerLink = providerJson["provider_link_ui"];
      // const providerLink = providerJson['provider_link_cli']
  
      return new Web3.providers.WebsocketProvider(providerLink);
    } catch (error) {
      throw "Cannot read provider";
    }
  };