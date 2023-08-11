import { OnCronjobHandler, OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';
import { ethers } from 'ethers';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */

const getDataFromEthereum = async (): Promise<string> => {
  const abi = [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [],
      name: 'getBlockTimeStamp',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];
  if (ethereum === null) {
    return 'Not Conected';
  }
  const provider = new ethers.BrowserProvider(ethereum);
  const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi,
    provider,
  );
  const blockTimeStamp = await contract.getBlockTimeStamp();
  return `Current block TimeStamp ${blockTimeStamp}`;
};

const testFunction = (): string => 'test from fn with cron';

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'checkStatus':
      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: await getDataFromEthereum(),
        },
      });

    default:
      throw new Error('Method not found.');
  }
};

export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: await getDataFromEthereum(),
        },
      });

    default:
      throw new Error('Method not found.');
  }
};
