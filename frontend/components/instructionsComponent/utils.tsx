'use client';

import { Address } from 'wagmi';
import { ErrorResponse, PortfolioResponse } from './interfaces';

export const handlePortfolioSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  address: Address,
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

export const extractTokenAddressToChainMap = (
  portfolioResponse: PortfolioResponse
): Record<string, string> => {
  // This object will hold the token address as key and chain ID as value

  const tokenAddressToChainMap: Record<string, string> = {};

  // Check if data exists and is an array before calling forEach
  if (portfolioResponse && Array.isArray(portfolioResponse.data)) {
    portfolioResponse.data.forEach((position) => {
      // Assuming that the primary token address is the first in the implementations array
      const tokenAddress =
        position.attributes.fungible_info.implementations[0]?.address;
      const chainId = position.relationships.chain.data.id;
      if (tokenAddress && chainId) {
        tokenAddressToChainMap[tokenAddress] = chainId;
      }
    });
  }

  console.log('tokenAddressToChainMap', tokenAddressToChainMap);

  return tokenAddressToChainMap;
};

export const handleConfirmSelection = (
  selectedAssets: Array<{ chainId: string; tokenAddress: string }>
) => {
  console.log('Selected assets:', selectedAssets);
  // Here you can further process the selected assets, e.g., storing them or making an API call
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
