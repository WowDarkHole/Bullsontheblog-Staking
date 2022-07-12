import Web3 from 'web3';
import { ethers } from "ethers";

const giftContractAbi = require('../giftAbi.json')
const contractAddress = "0x9d26792597F300A2Cf4A6cdA81730c7081B66985";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

let goldAddress = require('./goldAddress.json');
let silverAddress = require('./silverAddress.json');
let bronzeAddress = require('./bronzeAddress.json');

const correctMerkleTree = (address) => {
  // Hash addresses to get the leaves
  let leaves;
  console.log("Wallet Address: ", address);
  if (goldAddress.includes(address))
    leaves = goldAddress.map(addr => keccak256(addr));
  else if (silverAddress.includes(address))
    leaves = silverAddress.map(addr => keccak256(addr));
  else if (bronzeAddress.includes(address))
    leaves = bronzeAddress.map(addr => keccak256(addr));
  else {
    console.log("Leaves: ", leaves);
    return false;
  }

  console.log("Passed");

  // // Create tree
  let merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true })
  // Get root
  let rootHash = merkleTree.getRoot().toString('hex')

  return merkleTree;
}

export const mint = async (address) => {

  const { ethereum } = window;
  console.log("mint start");
  let holdStatus;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(
      contractAddress,
      giftContractAbi,
      signer
    );

    console.log("Contract Read and Connect Success");

    const leaf = keccak256(address);
    console.log("Checking Merkle Tree: ", correctMerkleTree(address));
    if (correctMerkleTree(address)) {
      const proof = correctMerkleTree(address).getHexProof(leaf);
      console.log("Gold: ", await nftContract.uri(1));
      console.log("prooft:", proof)
      console.log("Check:", await nftContract.checkNftHolder(proof))
      await nftContract.mint(proof);
    }

  }
  return holdStatus;
}
