import { createSmartAccountClient, ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico"
import { privateKeyToSimpleSmartAccount } from 'permissionless/accounts';
import { optimism } from 'viem/chains';
import { http, createPublicClient, encodeFunctionData } from 'viem';
import argon2 from 'react-native-argon2';
import Web3 from 'web3';

import { WEB3_URL, OPTIMISM_USDC_CONTRACT, ACCOUNT_FACTORY_ADDRESS, RPC_URL, PIMLICO_RPC_URL } from '@env';
const web3 = new Web3(WEB3_URL);
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
      entryPoint: ENTRYPOINT_ADDRESS_V07,
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

    const paymasterClient = createPimlicoPaymasterClient({
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      transport: http(PIMLICO_RPC_URL),
    });

    const pimlicoBundlerClient = createPimlicoBundlerClient({
      transport: http(PIMLICO_RPC_URL),
      entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

    const smartAccountClient = createSmartAccountClient({
      account: simpleAccount,
      chain: optimism,
      bundlerTransport: http(PIMLICO_RPC_URL),
      middleware: {
        sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
        gasPrice: async () => (await pimlicoBundlerClient.getUserOperationGasPrice()).fast, // if using pimlico bundler
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

    /*
        const txHash = await smartAccountClient.sendTransactions({
          transactions: [
            {
              account: smartAccountClient.account,
              to: OPTIMISM_USDC_CONTRACT,
              data: recipientData,
              value: 0n,
            },
            {
              account: smartAccountClient.account,
              to: OPTIMISM_USDC_CONTRACT,
              data: feeData,
              value: 0n,
            },
          ]
        });
    */
   
    const txHash = await smartAccountClient.sendTransaction({
      account: smartAccountClient.account,
      to: OPTIMISM_USDC_CONTRACT,
      data: recipientData,
      value: 0n,
    });

    return txHash;
  } catch (error) {
    console.error('Error during USDC transfer:', error);
    throw error.details;
  }
};



