'use client';

import { ChangeEvent, useState } from 'react';
import styles from './page.module.css';
import { PortfolioResponse } from './components/instructionsComponent/interfaces';
import { handlePortfolioSubmit } from './utils/utils'; // Update the import path accordingly
import { AssetTable } from './components/instructionsComponent/table';

export default function Home() {
  const [address, setAddress] = useState<string>('');
  //MAybe remove error response from this type
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className={styles.main}>
      <div>
        <form
          onSubmit={(event) =>
            handlePortfolioSubmit(
              event,
              address,
              setIsLoading,
              setError,
              setPortfolio
            )
          }
        >
          <input
            type="text"
            value={address}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAddress(e.target.value)
            }
            placeholder="Enter wallet address"
          />
          <button type="submit">Fetch Portfolio</button>
        </form>

        {isLoading && <p>Loading...</p>}

        {error && <p>Error: {error}</p>}

        {portfolio && (
          <div>
            {/* Render portfolio data here */}
            {/* <pre>{JSON.stringify(portfolio, null, 2)}</pre> */}
            <AssetTable portfolioData={portfolio} />
          </div>
        )}
      </div>
    </main>
  );
}
