import crypto from "crypto";

export const verifyContext = (publicKey:string, data:Buffer) => {

    const result = crypto.publicDecrypt(publicKey, data)
    console.log(result)

}