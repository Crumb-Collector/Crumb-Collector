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
} from '@chakra-ui/react';

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
    <Accordion allowMultiple>
      {Object.entries(positionsByChain).map(([chainId, positions]) => (
        <AccordionItem key={chainId}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Chain: {chainId}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <table className={styles.asset_table}>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Address</th>
                  <th>Value (USD)</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position: Position) => (
                  <tr key={position.id}>
                    <td>
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
                    </td>
                    <td>{position.attributes.fungible_info.name}</td>
                    <td>{position.attributes.fungible_info.symbol}</td>
                    <td>
                      {position.attributes.fungible_info.implementations[0]
                        ?.address || 'N/A'}
                    </td>
                    <td>{position.attributes.value?.toFixed(2) || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button mt={4} onClick={() => handleConfirmSelection(chainId)}>
              Confirm Selection
            </Button>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
