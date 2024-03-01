'use server';

import { ErrorResponse, PortfolioResponse } from './interfaces';

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
