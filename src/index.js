import { Contract, ethers } from "ethers";
import { ABI, tokenABI } from "./abi.js";


const berachainUrl = "https://bartio.rpc.berachain.com";
const provider = new ethers.JsonRpcProvider(berachainUrl);
const privateKey = "";
const contractaddress = "0x5aD441790c3114e0AB27816abdB0c9693cd96399";
const tokenContractAddress = "0x6679732D6C09c56faB4cBf589E01F5e41A2d9e67";
const wallet = new ethers.Wallet(privateKey,provider);
const Bullascontract = new ethers.Contract(contractaddress,ABI,wallet);
const tokenContract = new ethers.Contract(tokenContractAddress, tokenABI, wallet);

export async function findTokenId(wallet) {
    // 创建合约实例
    
    const tokenId = await tokenContract.tokenOfOwnerByIndex(wallet.address,0);
    return tokenId;
}
async function mint(wallet) {
    console.log("Wallet has no tokens, minting now...");
    const mintTx = await tokenContract.mint();
    await mintTx.wait(); // 等待交易被确认
    console.log("Mint transaction confirmed");
    // 等待 'Transfer' 事件通知
    const filter = tokenContract.filters.Transfer(null, wallet.address);
    const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transfer event timeout')), 20000) // 超时时间设置为 60 秒
    );
    await tokenContract.once(filter, async () => {
    console.log("Transfer event received, mint completed.")});}

async function find(wallet) {
    try {
        const tokenCount = await tokenContract.balanceOf(wallet.address);
        if(tokenCount.toString() === "0") {
            await mint(wallet);
            return await find(wallet)
        }else {
            const tokenId = await findTokenId(wallet)
            console.log("tokenId 是："+ tokenId.toString());
            
            return Number(tokenId.toString());
        }
    } catch (error) {
        console.log(error);
        
    }
    
}


try {
    const tokenId = find(wallet);
    for (let i = 0; i < 100; i++) {
        let success = false;
        while (!success) {
            try {
                const transaction = await Bullascontract.click(tokenId, "BULL ISH", { value: "42690000000000000" });
                await transaction.wait();
                console.log(`transaction confirmed 当前成功${i+1}次`);
                success = true; // 标记成功，退出循环
            } catch (error) {
                console.log("Error occurred, retrying...");
                
                // 加入一个短暂的延时以防止快速重试导致网络问题
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    }
} catch (error) {
    console.log("Unexpected error occurred:", error);
}



