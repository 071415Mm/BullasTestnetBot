import { Contract, ethers } from "ethers";
import { ABI, tokenABI } from "./abi.js";
import { findTokenId } from "./index.js";

const berachainUrl = "https://bera-testnet.nodeinfra.com";
const provider = new ethers.JsonRpcProvider(berachainUrl);
const privateKey = "0xe61b04443af350ac9d91428f74a41a5bfec29b077b76a2d0f03ab51b809ff434";
const contractaddress = "0x5aD441790c3114e0AB27816abdB0c9693cd96399";

const wallet = new ethers.Wallet(privateKey,provider);
const Bullascontract = new ethers.Contract(contractaddress,ABI,wallet);

console.log(findTokenId(wallet));
