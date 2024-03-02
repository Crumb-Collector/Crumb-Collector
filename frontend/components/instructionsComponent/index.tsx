import styles from './instructionsComponent.module.css';
import { ChangeEvent, useState } from 'react';
import { PortfolioResponse } from './interfaces';
import {
  extractTokenAddressToChainMap,
  handleConfirmSelection,
  handlePortfolioSubmit,
} from './utils'; // Update the import path accordingly
import { AssetAccordion } from './table';
import { useAccount } from 'wagmi';
import { Button, ButtonGroup } from '@chakra-ui/react';
import { ChakraProvider, Center, Input, useDisclosure, useToast} from '@chakra-ui/react';


export default function InstructionsComponent() {
  const [address, setAddress] = useState<string>('');
  //Maybe remove error response from this type
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
            <span>OOPS!</span>
          </h1>
          <h3>Pick up your mess! Save those coins ...</h3>
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
          <Center>
          <Input
            w='430px'
            m={2}
            type="text"
            value={address}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAddress(e.target.value)
            }
            placeholder="Enter wallet address"
          />
          <Button colorScheme='teal' type="submit">
            Fetch Portfolio
          </Button>
          </Center>
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
      {portfolio && (
      <div >
      <div className={styles.header_container}><h3>Where you wanna send those <span>CUMMY COOKIES</span>?</h3></div>
      <Input
            w='430px'
            m={2}
            type="text"
            value={address}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAddress(e.target.value)
            }
            placeholder="Enter destination address"
          />
          <Button colorScheme='teal' type="submit">
            Sumbit
          </Button>
      </div>
      )}
    </div>
  );
}


