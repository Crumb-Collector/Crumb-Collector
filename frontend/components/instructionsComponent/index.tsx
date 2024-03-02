import styles from './instructionsComponent.module.css';
import { ChangeEvent, useState } from 'react';
import { PortfolioResponse } from './interfaces';
import {
  extractTokenAddressToChainArray,
  handleConfirmSelection,
  handlePortfolioSubmit,
} from '../../utils/utils'; // Update the import path accordingly
import { AssetAccordion } from './table';

export default function InstructionsComponent() {
  const [address, setAddress] = useState<string>('');
  //MAybe remove error response from this type
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // if (portfolio) {
  //   console.log(
  //     'Address to Chain Mapping:',
  //     extractTokenAddressToChainArray(portfolio)
  //   );
  // }

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

      <div className={styles.buttons_container}>
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
          <button className={styles.button} type="submit">
            <p>Fetch Portfolio</p>Fetch Portfolio
          </button>
        </form>

        {isLoading && <p>Loading...</p>}

        {error && <p>Error: {error}</p>}

        {portfolio && (
          <div>
            {/* Render portfolio data here */}
            <AssetAccordion
              portfolioData={portfolio}
              onConfirmSelection={handleConfirmSelection(portfolio)}
            />
          </div>
        )}
      </div>

      <div className={styles.buttons_container}>
        <a
          target={'_blank'}
          href={'https://createweb3dapp.alchemy.com/#components'}
        >
          <div className={styles.button}>
            {/* <img src="https://static.alchemyapi.io/images/cw3d/Icon%20Medium/lightning-square-contained-m.svg" width={"20px"} height={"20px"} /> */}
            <p>Add Components</p>
          </div>
        </a>
        <a
          target={'_blank'}
          href={'https://createweb3dapp.alchemy.com/#templates'}
        >
          <div className={styles.button}>
            {/* <img src="https://static.alchemyapi.io/images/cw3d/Icon%20Medium/lightning-square-contained-m.svg" width={"20px"} height={"20px"} /> */}
            <p>Explore Templates</p>
          </div>
        </a>
        <a
          target={'_blank'}
          href={'https://docs.alchemy.com/docs/create-web3-dapp'}
        >
          <div className={styles.button}>
            <img
              src="https://static.alchemyapi.io/images/cw3d/Icon%20Large/file-eye-01-l.svg"
              width={'20px'}
              height={'20px'}
            />
            <p>Visit Docs</p>
          </div>
        </a>
        <a>
          <div className={styles.button}>
            {/* <img src="https://static.alchemyapi.io/images/cw3d/Icon%20Medium/lightning-square-contained-m.svg" width={"20px"} height={"20px"} /> */}
            <p>Contribute</p>
          </div>
        </a>
      </div>
    </div>
  );
}
