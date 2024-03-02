'use client';

import { PortfolioResponse } from '../components/instructionsComponent/interfaces';
import { ethers } from 'ethers';
import { extractChainIdMapping } from './getChainMapping';
import { replaceChainIdWithNumber } from './replaceChainIdWithNumber';

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

// export interface PortfolioResponse {
//   data: Array<{
//     type: string;
//     id: string;
//     // ... other properties
//     relationships: {
//       chain: {
//         data: {
//           id: string;
//         };
//       };
//       // ... other properties
//     };
//     attributes: {
//       fungible_info: {
//         implementations: Array<{
//           address: string | null;
//         }>;
//       };
//     };
//   }>;
// }

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

  // console.log('mapping', tokenAddressToChainArray);

  return tokenAddressToChainArray;
};

export const handleConfirmSelection = async (
  selectedAssets: PortfolioResponse
) => {
  // Take the selectedAssets identified by the user and convert that information into a useful array.
  const keyValueArray: { address: string; chainId: string }[] =
    extractTokenAddressToChainArray(selectedAssets);

  // Get the chainId info from the zerion endpoint
  const chainIdMapping = await extractChainIdMapping();

  // Use the Zerion info to update our "keyValueArray"
  const updatedArray = replaceChainIdWithNumber(keyValueArray, chainIdMapping);

  console.log('updated array', updatedArray);

  // tokenAddresses.forEach(async (tokenAddress) => {
  //   await transferAllTokens(wallet, tokenAddress, recipient, chainId);
  // });

  // TODO - replace recipient address
  // executeTokenTransfers(keyValueMap, 'RecipientAddress', wallet);
};
export function formatHash(hash: any, visibleCharacters: number = 6): string {
  if (typeof hash !== 'string' || hash.length <= visibleCharacters * 2) {
    return String(hash);
  }

  const start: string = hash.slice(0, visibleCharacters);
  const end: string = hash.slice(-visibleCharacters);
  const middle: string = '...';

  return `${start}${middle}${end}`;
}
// TODO -> consider: you might want to use a dedicated provider like Infura or Alchemy for better reliability and control over your RPC requests.
