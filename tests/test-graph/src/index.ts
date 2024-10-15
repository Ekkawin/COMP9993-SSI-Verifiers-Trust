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

    const x = await axios.post("http://4.240.54.55/graph", {
      srcAddress: verifierData,
      desAddress: taData,
    });
    const end = new Date();

    fs.appendFileSync(`./${concurrency}_result.txt`, `${end.getTime() - start.getTime()}\n`);
    // console.log("x",x)

    // console.log(verifierData, "\n", taData);
    // console.log(taData.split("\n")[99]);
  } catch (e) {
    console.log(e);
    fs.appendFileSync(`./${concurrency}_result.txt`, `0\n`);
  }
}

main();
