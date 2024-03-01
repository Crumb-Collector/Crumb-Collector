'use client';

import { PortfolioResponse } from '../components/instructionsComponent/interfaces';
import { ethers } from 'ethers';
import { getChainMapping } from './getChainMapping';

export const handlePortfolioSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  address: string,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setPortfolio: (portfolio: PortfolioResponse | null) => void
) => {
  event.preventDefault(); // This should be the first line in your submit handler
  if (!address) return; // TODO - ETH ADDRESS VALIDATION or any other address validation

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Basic ${process.env.NEXT_PUBLIC_ZERION_API_DEV_KEY}`,
    },
  };

  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(
      // this sorts by dollar Value instead of by chain
      // `https://api.zerion.io/v1/wallets/${address}/positions/?currency=usd&filter[trash]=only_non_trash&sort=value`,
      `https://api.zerion.io/v1/wallets/${address}/positions/?currency=usd&filter[trash]=only_non_trash`,
      options
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data: PortfolioResponse = await response.json();
    setPortfolio(data);
    console.log(data);
  } catch (err) {
    console.error('PortfolioResponseError', err);
    setError(err instanceof Error ? err.message : String(err));
  } finally {
    setIsLoading(false);
  }
};

// interface Position {
//   id: string;
//   relationships: {
//     chain: {
//       data: {
//         id: string;
//       };
//     };
//   };
// }

// interface PortfolioResponse {
//   data: Position[];
// }

export interface PortfolioResponse {
  data: Array<{
    type: string;
    id: string;
    // ... other properties
    relationships: {
      chain: {
        data: {
          id: string;
        };
      };
      // ... other properties
    };
    attributes: {
      fungible_info: {
        implementations: Array<{
          address: string | null;
        }>;
      };
    };
  }>;
}

export const extractTokenAddressToChainArray = (
  portfolioResponse: PortfolioResponse
): { address: string; chainId: string }[] => {
  const tokenAddressToChainArray: { address: string; chainId: string }[] = [];

  portfolioResponse.data.forEach((position) => {
    const chainId = position.relationships.chain.data.id;
    if (position.id.includes('base')) {
      // This is a native token, use a placeholder like "native-asset"
      tokenAddressToChainArray.push({
        address: 'native-asset',
        chainId: chainId,
      });
    } else {
      // This is a regular token, use the address from implementations
      const tokenAddress =
        position.attributes.fungible_info.implementations[0]?.address;
      if (tokenAddress) {
        tokenAddressToChainArray.push({
          address: tokenAddress,
          chainId: chainId,
        });
      } else {
        // If the token address is null or undefined, we still need to account for the chain
        tokenAddressToChainArray.push({ address: '', chainId: chainId });
      }
    }
  });

  console.log('mapping', tokenAddressToChainArray);

  return tokenAddressToChainArray;
};

export const handleConfirmSelection = (selectedAssets: PortfolioResponse) => {
  console.log('Selected assets2:', selectedAssets);

  // Parse the array into an array of
  const keyValueMap: Record<string, string> =
    extractTokenAddressToChainArray(selectedAssets);

  // Parse chainID name to number

  // TODO - replace recipient address
  // executeTokenTransfers(keyValueMap, 'RecipientAddress', wallet);
  console.log('getChainMapping:', getChainMapping());

  // tokenAddresses.forEach(async (tokenAddress) => {
  //   await transferAllTokens(wallet, tokenAddress, recipient, chainId);
  // });
};

// TODO -> consider: you might want to use a dedicated provider like Infura or Alchemy for better reliability and control over your RPC requests.

interface TransferAllTokensParams {
  wallet: ethers.Wallet; // User's wallet, connected to a provider
  tokenAddress: string; // Contract address of the ERC20 token
  recipient: string; // Recipient address
  chainId: number; // Chain ID
}

async function transferAllTokens({
  wallet,
  tokenAddress,
  recipient,
  chainId,
}: TransferAllTokensParams): Promise<ethers.ContractTransaction | undefined> {
  const provider = ethers.getDefaultProvider(chainId);
  wallet = wallet.connect(provider);

  const erc20Abi = [
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint amount) returns (bool)',
  ];
  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);

  // Fetch the current balance
  const balance = await tokenContract.balanceOf(wallet.address);

  // If balance is more than 0, proceed with the transfer
  if (!balance.isZero()) {
    const tx = await tokenContract.transfer(recipient, balance);
    console.log(
      `Transferring all tokens (${balance.toString()}) to ${recipient}`
    );
    return tx;
  } else {
    console.log('Balance is 0, no tokens to transfer.');
    return undefined;
  }
}

export async function executeTokenTransfers(
  tokens: Record<string, number>,
  recipient: string,
  wallet: ethers.Wallet
) {
  for (const [tokenAddress, chainId] of Object.entries(tokens)) {
    try {
      const tx = await transferAllTokens({
        wallet,
        tokenAddress,
        recipient,
        chainId,
      });

      if (tx) {
        console.log(`Transfer successful for token ${tokenAddress}`);
      }
    } catch (error) {
      console.error(`Transfer failed for token ${tokenAddress}: ${error}`);
    }
  }
}
