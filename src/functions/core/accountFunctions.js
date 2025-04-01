import { toSimpleSmartAccount } from "permissionless/_esm/accounts"
import { createPublicClient, http, encodeFunctionData  } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { entryPoint07Address } from "viem/account-abstraction"
import { sepolia, baseSepolia } from "viem/chains"
import { createPimlicoClient } from "permissionless/_esm/clients/pimlico"
import { createSmartAccountClient } from "permissionless/_esm/"


import argon2 from 'react-native-argon2';
import Web3 from 'web3';

import { WEB3_URL, BASE_USDC_CONTRACT, ACCOUNT_FACTORY_ADDRESS, RPC_URL } from '@env';
console.log('chain: ', 'https://sepolia.base.org');
const web3 = new Web3('https://sepolia.base.org');
const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const factoryAddress = '0x9406Cc6185a346906296840746125a0E44976454';
const pimlicoUrl = 'https://api.pimlico.io/v2/84532/rpc?apikey=pim_UvGRM5DmWTcGZj7pjTP5L7'

let salt = 'BklcooclkncUhnaiianhUcnklcooclkB';

export const accountLogin = async (tag, password) => {
  try {
    let tempDataChain = tag + password;
    const argonResult = await argon2(
      tempDataChain,
      salt,
      {
        iterations: 4,
        memory: 32768,
        parallelism: 2,
        mode: 'argon2id'
      }
    );
    let finalDataChain = argonResult.rawHash;
    const innerHash = web3.utils.keccak256(finalDataChain);
    let privateKey = web3.utils.keccak256(innerHash + finalDataChain);

    //let oneTimeEncryptionPW = web3.utils.randomHex(32);
    //let encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, oneTimeEncryptionPW).toString();
    //let decryptedAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    //let publicKey = decryptedAccount.address;
    //console.log('encryptedPrivateKey: ', encryptedPrivateKey);
    //console.log('oneTimeEncryptionPW: ', oneTimeEncryptionPW);
    //console.log('EOA publicKey: ', publicKey);

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http("https://sepolia.base.org"),
    })

    const simpleAccount = await toSimpleSmartAccount({ 
      client: publicClient, 
      owner: privateKeyToAccount(privateKey),
      entryPoint: { // optional, defaults to 0.7
          address: entryPoint07Address, 
          version: "0.7", 
      }, 
      factory: factoryAddress
    })

    return simpleAccount;

  } catch (error) {
    console.log('Error logging in or creating account:', error);
    throw error;
  }
};




const PIMLICO_RPC_URL = 'https://api.pimlico.io/v2/84532/rpc?apikey=pim_UvGRM5DmWTcGZj7pjTP5L7';

export const transferUSDC = async (tag, password, amount, recipient) => {
  let simpleAccount = await accountLogin(tag, password);
  console.log(simpleAccount.address);
  console.log('simpleAccount:', simpleAccount);
  try {

    
    const pimlicoClient = createPimlicoClient({
      transport: http(pimlicoUrl),
      entryPoint: {
        address: entryPoint07Address,
        version: "0.7",
      },
    })

    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount, // Ensure this is set
      chain: baseSepolia,
      bundlerTransport: http(pimlicoUrl),
      paymaster: pimlicoClient,
      userOperation: {
        estimateFeesPerGas: async () => {
          return (await pimlicoClient.getUserOperationGasPrice()).fast
        },
      },
    })

    const decimals = 6; // USDC has 6 decimal places
  const amountInWei = BigInt(Math.floor(Number(amount) * 10 ** decimals));

    console.log(amountInWei)
  // Encode the data for the transfer function
  const data = encodeFunctionData({
    abi: abi,
    functionName: 'transfer',
    args: [recipient, amountInWei],  // Transfer 2 USDC (2000000 units)
  });
  console.log(BASE_USDC_CONTRACT)
  const txHash = await smartAccountClient.sendTransaction({
    to: BASE_USDC_CONTRACT,  // USDC contract address
    value: 0n,               // No Ether is sent (USDC is an ERC-20 token)
    data: data,              // Data to call transfer method in the USDC contract
  });
   
  console.log(`User operation included: https://sepolia.etherscan.io/tx/${txHash}`)
    console.log(txHash)
    return txHash;
  } catch (error) {
    console.error('Error during USDC transfer:', error);
    throw error;
  }
};


