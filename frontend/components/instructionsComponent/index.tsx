import styles from './instructionsComponent.module.css';
import { ChangeEvent, useState } from 'react';
import { PortfolioResponse } from './interfaces';
import {
  extractTokenAddressToChainMap,
  handleConfirmSelection,
  handlePortfolioSubmit,
} from './utils'; // Update the import path accordingly
import { AssetAccordion } from './table';

export default function InstructionsComponent() {
  const [address, setAddress] = useState<string>('');
  //MAybe remove error response from this type
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (portfolio) {
    console.log(
      'Address to Chain Mapping:',
      extractTokenAddressToChainMap(portfolio)
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>
            <span>CRUMB COLLECTOR</span>
          </h1>
          <h3>Pick up your mess! Collect those coins ...</h3>
        </div>
      </header>

      <div >
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
          <button type="submit">
            Fetch Portfolio
          </button>
        </form>

        {isLoading && <p>Loading...</p>}

        {error && <p>Error: {error}</p>}

        {portfolio && (
          <div>
            {/* Render portfolio data here */}
            <AssetAccordion
              portfolioData={portfolio}
              onConfirmSelection={handleConfirmSelection}
            />
          </div>
        )}
      </div>
    </div>
  );
}
