import axios from "axios";
import * as fs from "fs";

async function main() {
  const start = new Date();
  const data = fs.readFileSync("../../.dev.txt", "utf-8");
  const verifierIndex = Number(process.argv.slice(2)[0]);
  const taIndex = Number(process.argv.slice(2)[1]);
  const concurrency = Number(process.argv.slice(2)[2]);
  // console.log(verifierIndex, taIndex);
  try {
    const verifierData = fs.readFileSync("./verifier.txt", "utf-8").split("\n")[
      verifierIndex
    ];
    const taData = fs.readFileSync("./trustanchor.txt", "utf-8").split("\n")[
      taIndex
    ];

    const x = await axios.post(
      "http://20.197.15.71/graph",
      {
        srcAddress: verifierData,
        desAddress: taData,
        holderWallet: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      },
      { timeout: 100000 }
    );
    const end = new Date();

    fs.appendFileSync(
      `./${concurrency}_result_Hardhat.txt`,
      `Hardhat, ${end.getTime() - start.getTime()}\n`
    );
    // console.log("x",x)

    // console.log(verifierData, "\n", taData);
    // console.log(taData.split("\n")[99]);
  } catch (e) {
    // console.log(e);
    fs.appendFileSync(`./${concurrency}_result_Hardhat.txt`, `Hardhat, 0\n`);
  }
}

main();
