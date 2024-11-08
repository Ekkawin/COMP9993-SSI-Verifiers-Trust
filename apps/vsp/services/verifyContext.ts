import crypto from "crypto";

export const verifyContext = (publicKey:string, data:NodeJS.ArrayBufferView) => {

    const result = crypto.publicDecrypt(publicKey, data).toString()
    console.log("result", result)

}