import styles from './instructionsComponent.module.css';
import { ChangeEvent, useState, useEffect } from 'react';
import { PortfolioResponse } from './interfaces';
import {
  extractTokenAddressToChainArray,
  getPortfolio,
} from '../../utils/utils'; // Update the import path accordingly
import { AssetAccordion } from './table';
import { useAccount } from 'wagmi';
import { Button, Input, Flex, Center } from '@chakra-ui/react'; // Added Flex
import { Address } from 'viem';

export default function InstructionsComponent() {
  const [address, setAddress] = useState<Address>('0x');
  const [toAddress, setToAddress] = useState<string>('');
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    address: walletAddress,
    isConnecting,
    isDisconnected,
    isConnected,
  } = useAccount();
  useEffect(() => {
    // Check if wallet is connected and perform action
    if (isConnected && walletAddress) {
      getPortfolio(
        mockEvent,
        walletAddress,
        setIsLoading,
        setError,
        setPortfolio
      );
    }
  }, [isConnected, walletAddress]);

  const mockEvent = {
    preventDefault: () => { }, // Mock the preventDefault function
    currentTarget: {
      reset: () => { }, // Mock the reset function if used in your code
    },
  } as React.FormEvent<HTMLFormElement>;

  return (
    <div>
      <div className={styles.container}>
        <header className={styles.header_container}>
          <div className={styles.header}>
            <h1>
              <span>OOPS!</span>
            </h1>
            <h3>Pick up your mess! Save those coins ...</h3>
          </div>
        </header>
      </div>

      <div>
        <Center>
          <Flex direction="column">
            {isConnecting || isDisconnected ? (
              <form
                onSubmit={(event) =>
                  getPortfolio(
                    event,
                    address,
                    setIsLoading,
                    setError,
                    setPortfolio
                  )
                }
              >
                <Input
                  w="430px"
                  m={2}
                  type="text"
                  value={address}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAddress(e.target.value as Address)
                  }
                  placeholder="Enter wallet address"
                />
                <Button colorScheme="teal" width="130px" type="submit">
                  Fetch Portfolio
                </Button>
              </form>
            ) : (
              <Center>
                <Input
                  w="562px"
                  m={2}
                  isReadOnly
                  textAlign="center"
                  value={walletAddress || ''}
                  placeholder={walletAddress || ''}
                />
              </Center>
            )}

            {isLoading && <p>Loading...</p>}

            {error && <p>Error: {error}</p>}

            {portfolio && (
              <form>
                <input type="hidden" name="tokens" />
                <Input
                  w="430px"
                  m={2}
                  type="text"
                  name='toAddress'
                  value={toAddress}
                  onChange={(f: ChangeEvent<HTMLInputElement>) =>
                    setToAddress(f.target.value)
                  }
                  placeholder="Enter destination address"
                />
                <Button colorScheme="teal" width="130px" type="submit">
                  Submit
                </Button>
              </form>
            )}
          </Flex>
        </Center>
      </div>

      {portfolio && (
        <div>
          <Center>
            {/* Render portfolio data here */}
            <AssetAccordion
              portfolioData={portfolio}
            />
          </Center>
        </div>
      )}
    </div>
  );
}
