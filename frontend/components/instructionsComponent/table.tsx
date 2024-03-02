import React, { useState } from 'react';
import { PortfolioResponse, Position } from './interfaces';
import styles from '../../app/page.module.css';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useAccount } from "wagmi";
import { formatHash } from './utils';


interface TableProps {
  portfolioData: PortfolioResponse;
  onConfirmSelection: (
    selectedAssets: Array<{ chainId: string; tokenAddress: string }>
  ) => void;
}

export const AssetAccordion: React.FC<TableProps> = ({
  portfolioData,
  onConfirmSelection,
}) => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { isConnecting, isDisconnected } = useAccount();

  // Group positions by chain ID
  const positionsByChain = portfolioData.data.reduce((acc: any, position) => {
    const { id } = position.relationships.chain.data;
    acc[id] = acc[id] ? [...acc[id], position] : [position];
    return acc;
  }, {});

  const handleRowSelectionChange = (positionId: string, isChecked: boolean) => {
    setSelectedRows((prev) => ({ ...prev, [positionId]: isChecked }));
  };

  const handleConfirmSelection = (chainId: string) => {
    const selectedAssets = portfolioData.data
      .filter(
        (position) =>
          selectedRows[position.id] &&
          position.relationships.chain.data.id === chainId
      )
      .map((position) => ({
        chainId: position.relationships.chain.data.id,
        tokenAddress:
          position.attributes.fungible_info.implementations[0]?.address || '',
      }));
    onConfirmSelection(selectedAssets);
  };

  return (
    <Accordion defaultIndex={[0]} maxW="800px" m="20px" >
      {Object.entries(positionsByChain).map(([chainId, positions]) => (
        <AccordionItem key={chainId}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="bold">
                {chainId.charAt(0).toUpperCase() + chainId.slice(1)}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Table className={styles.asset_table}>
              <Thead>
                <Tr>
                  <Th width="14%">Select</Th>
                  <Th width="23%">Name</Th>
                  <Th width="15%">Symbol</Th>
                  <Th width="23%">Address</Th>
                  <Th width="15%">Value (USD)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {positions.map((position: Position) => (
                  <Tr key={position.id}>
                    <Td>
                      <input
                        type="checkbox"
                        checked={!!selectedRows[position.id]}
                        onChange={(e) =>
                          handleRowSelectionChange(
                            position.id,
                            e.target.checked
                          )
                        }
                      />
                    </Td>
                    <Td>{position.attributes.fungible_info.name}</Td>
                    <Td>{position.attributes.fungible_info.symbol}</Td>
                    <Td>
                      {position.attributes.fungible_info.implementations[0]
                        ?.address ? formatHash(position.attributes.fungible_info.implementations[0].address) : 'N/A'}
                    </Td>
                    <Td>{position.attributes.value?.toFixed(2) || 'N/A'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button mt={4} px={4} py={2} onClick={() => handleConfirmSelection(chainId)}
              isDisabled={isConnecting || isDisconnected}>
              {isConnecting || isDisconnected ? "CONNECT WALLET TO CONFIRM" : "Confirm Selection"}
            </Button>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>

  );
};
