import crypto, { hash } from "crypto";

interface MerkelProof {
  hash: string;
  direction: string;
}

export const compileHashAddresses = (addresses: string[]): string[] => {
  const a = [];
  for (let i = 0; i < addresses.length; i++) {
    a.push(crypto.createHash("sha256").update(addresses[i]).digest("hex"));
  }
  return a;
};
export const compileRootHash = (hashes: string[]): string => {
  if (hashes.length === 1) {
    return hashes[0];
  }
  const newArrayValue: string[] = [];

  for (let i = 0; i < hashes.length; i += 2) {
    const firstHash = hashes[i];
    let finalHash = firstHash;
    if (i < hashes.length - 1) {
      finalHash = crypto
        .createHash("sha256")
        .update(firstHash + hashes[i + 1])
        .digest("hex");
    }
    newArrayValue.push(finalHash);
  }

  return compileRootHash(newArrayValue);
};

export const makeMarkelTree = (hashes: string[][]): string[][] => {
  if (hashes[hashes.length - 1].length === 1) {
    return hashes;
  }

  const newHashes: string[] = [];

  for (let i = 0; i < hashes[hashes.length - 1].length; i += 2) {
    const firstHash = hashes[hashes.length - 1][i];
    let finalHash = firstHash;
    if (i < hashes[hashes.length - 1].length - 1) {
      finalHash = crypto
        .createHash("sha256")
        .update(firstHash + hashes[hashes.length - 1][i + 1])
        .digest("hex");
    }

    newHashes.push(finalHash);
  }
  hashes.push(newHashes);

  return makeMarkelTree(hashes);
};

const getLeafNodeDirectionInMerkleTree = (
  hash: string,
  merkleTree: string[][]
) => {
  const hashIndex = merkleTree[0].findIndex((h) => h === hash);
  return hashIndex % 2 === 0 ? "left" : "right";
};

export const generateMerkleProof = (
  hash: string,
  hashes: string[]
): MerkelProof[] => {
  // if (!hash || !hashes || hashes.length === 0) {
  //   return null;
  // }
  const tree = makeMarkelTree([hashes]);
  const merkleProof = [
    {
      hash,
      direction: getLeafNodeDirectionInMerkleTree(hash, tree),
    },
  ];
  let hashIndex = tree[0].findIndex((h) => h === hash);
  for (let level = 0; level < tree.length - 1; level++) {
    const isLeftChild = hashIndex % 2 === 0;
    const siblingDirection = isLeftChild ? "right" : "left";
    const siblingIndex = isLeftChild ? hashIndex + 1 : hashIndex - 1;
    const siblingNode = {
      hash: tree[level][siblingIndex],
      direction: siblingDirection,
    };
    merkleProof.push(siblingNode);
    hashIndex = Math.floor(hashIndex / 2);
  }
  return merkleProof;
};

export const makeMerkelRootFromProof = (proofs: MerkelProof[]): string => {
  let proof = proofs[0].hash;
  for (let i = 1; i < proofs.length; i++) {
    if (proofs[i].direction === "right") {
      proof = crypto
        .createHash("sha256")
        .update(proof + proofs[i].hash)
        .digest("hex");
    } else {
      proof = crypto
        .createHash("sha256")
        .update(proofs[i].hash + proof)
        .digest("hex");
    }
  }
  return proof;
};
