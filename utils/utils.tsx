'use client';

import { getPortfolio } from '@/app/actions';
import {
  PortfolioResponse,
  Position,
} from '../components/instructionsComponent/interfaces';
import { Address } from 'viem';

export const getPortfolioClient = async (
  event: React.FormEvent<HTMLFormElement>,
  address: Address,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: string | null) => void,
  setPortfolio: (portfolio: PortfolioResponse | null) => void
) => {
  event.preventDefault(); // This should be the first line in your submit handler
  if (!address) return; // TODO - ETH ADDRESS VALIDATION or any other address validation

  setIsLoading(true);
  setError(null);

  try {
    const portfolio = await getPortfolio(address);
    if (!portfolio) {
      throw new Error('No portfolio found');
    }
    setPortfolio(portfolio);
  } catch (err) {
    console.error('PortfolioResponseError', err);
    setError(err instanceof Error ? err.message : String(err));
  } finally {
    setIsLoading(false);
  }
};

export const extractTokenAddressToChainArray = (
  portfolioResponse: Position[]
): { address: string; chainId: string }[] => {
  const tokenAddressToChainArray: { address: string; chainId: string }[] = [];
  portfolioResponse.forEach((position) => {
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
