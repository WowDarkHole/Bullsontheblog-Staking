import Web3 from 'web3';
import { ethers } from "ethers";

const giftContractAbi = require('../giftAbi.json')
const contractAddress = "0x55Abbe11044E3DC8A0a0142D11c968a28A7e18D9";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

let goldAddress = require('./goldAddress.json');
let silverAddress = require('./silverAddress.json');
let bronzeAddress = require('./bronzeAddress.json');

const correctMerkleTree = (address) => {
  // Hash addresses to get the leaves
  let leaves;
  console.log("Wallet Address: ", address);
  if (goldAddress.includes(address)) {
    leaves = goldAddress.map(addr => keccak256(addr));
    console.log("Gold");
  }
  else if (silverAddress.includes(address)) {
    leaves = silverAddress.map(addr => keccak256(addr));
    console.log("silver");
  }
  else if (bronzeAddress.includes(address)) {
    leaves = bronzeAddress.map(addr => keccak256(addr));
    console.log("bronze");
  }
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
  let holdStatus = 0;
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
      holdStatus = 1;
      const checkMerkle = correctMerkleTree(address);
      console.log("1");
      const proof = checkMerkle.getHexProof(leaf);
      console.log("2");
      console.log("Bronze: ", await nftContract.uri(3));
      console.log("proof:", proof)
      console.log("Check:", await nftContract.checkNftHolder(proof))
      await nftContract.mint(proof);
      console.log("Minted!");
      holdStatus = 2;
    }
  }
  return holdStatus;
}
