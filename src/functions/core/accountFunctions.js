import { createSmartAccountClient, ENTRYPOINT_ADDRESS_V06 } from 'permissionless';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { privateKeyToSimpleSmartAccount } from 'permissionless/accounts';
import { baseSepolia } from 'viem/chains';
import { http, createPublicClient, encodeFunctionData } from 'viem';
import { RPC_URL, ACCOUNT_FACTORY_ADDRESS } from '@env';

import argon2 from 'react-native-argon2';
import Web3 from 'web3';
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

const usdcContractAddress = '0x036cbd53842c5426634e7929541ec2318f3dcf7e'
const factoryAddress = ACCOUNT_FACTORY_ADDRESS;

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

    const client = createPublicClient({
      transport: http(RPC_URL),
    });
    const simpleAccount = await privateKeyToSimpleSmartAccount(client, {
      privateKey: privateKey,
      factoryAddress: factoryAddress,
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });
    return simpleAccount;
  } catch (error) {
    console.log('Error logging in or creating account:', error);
    throw error;
  }
};

export const transferUSDC = async (tag, password, amount, recipient) => {
  let simpleAccount = await accountLogin(tag, password);
  try {
    const factor = 10 ** 6; 
    const amountInWei = BigInt(parseFloat(amount) * factor);

    const cloudPaymaster = createPimlicoPaymasterClient({
      chain: baseSepolia,
      transport: http(RPC_URL),
      entryPoint: ENTRYPOINT_ADDRESS_V06,
    });

    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain: baseSepolia,
      bundlerTransport: http(RPC_URL),
      middleware: {
        sponsorUserOperation: cloudPaymaster.sponsorUserOperation,
      },
    });

    const recipientData = encodeFunctionData({
      abi: abi,
      functionName: 'transfer',
      args: [recipient, amountInWei],
    });

    const feeData = encodeFunctionData({
      abi: abi,
      functionName: 'transfer',
      args: ['0x179F961d5A0cC6FCB32e321d77121D502Fe3abF4', 0n], //could be any account
    });

    const txHash = await smartAccountClient.sendTransactions({
      transactions: [
        {
          account: smartAccountClient.account,
          to: usdcContractAddress,
          data: recipientData,
          value: 0n,
        },
        {
          account: smartAccountClient.account,
          to: usdcContractAddress,
          data: feeData,
          value: 0n,
        },
      ]
    });
    return txHash;
  } catch (error) {
    console.error('Error during USDC transfer:', error);
    throw error.details;
  }
};





