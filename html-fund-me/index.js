import { ethers } from "./ether.min.js";
import { abi, contractAddress } from "./constants.js";

const connectBtn = document.getElementById("connect-btn");
const ownerBtn = document.getElementById("owner-btn");
const fundBtn = document.getElementById("fund-btn");
const minimumEth = document.getElementById("minimum-amount");
const balanceBtn = document.getElementById("balance");
const withdrawBtn = document.getElementById("withdraw-btn");
const addressPara = document.getElementById("address");
const statusPara = document.getElementById("status");

const connect = async () => {
  if (typeof window.ethereum !== "undefined") {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts["0"];
    connectBtn.innerHTML = "Connected!";
    connectBtn.disabled = true;
    addressPara.innerHTML = `Connected wallet address ${account}`;
  } else {
    alert("Please install Metamask to connect your wallet!");
  }
};

const owner = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const response = await contract.getOwner();
      statusPara.innerHTML = response;
    } catch (err) {
      console.error(err);
      statusPara.innerHTML = err.message;
    }
  } else {
    alert("Yor are not connected to web3!");
  }
};

function listenForTransactionMine(txResponse, provider) {
  console.log(`Mining ${txResponse.hash}....`);
  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (txReceipt) => {
      console.log(`Completed with ${txReceipt.confirmations} confirmations.`);
      resolve();
    });
  });
}

const fund = async () => {
  const ethAmount = document.getElementById("eth-amount").value;
  if (typeof window.ethereum !== "undefined") {
    statusPara.innerHTML = "Funding contract........";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // waiting for 1 more block or transaction confirm
      // await txResponse.wait(1);
      await listenForTransactionMine(txResponse, provider);
      statusPara.innerHTML = "Funded successful";
    } catch (err) {
      console.error(err);
      statusPara.innerHTML = err.message;
    }
  } else {
    alert("Please install Metamask to connect your wallet!");
  }
};

const withdraw = async () => {
  if (typeof window.ethereum !== "undefined") {
    statusPara.innerHTML = "Withdraw from  contract........";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txResponse = await contract.withdraw();
      // await txResponse.wait(1);
      await listenForTransactionMine(txResponse, provider);
      statusPara.innerHTML = "Withdraw successful";
    } catch (err) {
      console.error(err);
      statusPara.innerHTML = err.message;
    }
  } else {
    alert("Please install Metamask to connect your wallet!");
  }
};

const minEth = async () => {
  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try{
      const txResponse = await contract.MINIMUM_USD();
      statusPara.innerHTML = `Minimum USD $${txResponse / 1e18}`;
    }catch(err) {
      console.error(err);
      statusPara.innerHTML = err.message;
    }
  }else{
    alert("Please install Metamask to your browser!");
  }
}

const getBalance = async () => {
  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try{
      const balance = await provider.getBalance(contractAddress);
      statusPara.innerHTML = `Contract Current Balance ${ethers.utils.formatEther(balance)} ETH.`;
    }catch (err) {
      console.error(err);
      statusPara.innerHTML = err.message;
    }
  }else{
    alert("Please install metamask to your browser!");
  }
}

connectBtn.onclick = connect;
fundBtn.onclick = fund;
ownerBtn.onclick = owner;
withdrawBtn.onclick = withdraw;
minimumEth.onclick = minEth;
balanceBtn.onclick = getBalance;