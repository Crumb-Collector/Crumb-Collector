import React, { useState } from 'react';
import { PortfolioResponse, Position } from './interfaces';
import { color } from '@chakra-ui/react';
import styles from '../../app/page.module.css';

interface TableProps {
  portfolioData: PortfolioResponse;
  onConfirmSelection: (
    selectedAssets: Array<{ chainId: string; tokenAddress: string }>
  ) => void;
}

export const AssetTable: React.FC<TableProps> = ({
  portfolioData,
  onConfirmSelection,
}) => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const handleRowSelectionChange = (positionId: string, isChecked: boolean) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [positionId]: isChecked,
    }));
  };

  const handleConfirmSelection = () => {
    const selectedAssets = portfolioData.data
      .filter((position) => selectedRows[position.id])
      .map((position) => ({
        chainId: position.relationships.chain.data.id,
        tokenAddress:
          position.attributes.fungible_info.implementations[0]?.address || '',
      }));
    onConfirmSelection(selectedAssets);
  };

  return (
    <>
      <table className={styles.asset_table}>
        <thead>
          <tr>
            <th>Select</th>
            <th>Chain ID</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Address</th>
            <th>Value (USD)</th>
          </tr>
        </thead>
        <tbody>
          {portfolioData.data.map((position: Position) => (
            <tr key={position.id}>
              <td>
                <input
                  type="checkbox"
                  checked={!!selectedRows[position.id]}
                  onChange={(e) =>
                    handleRowSelectionChange(position.id, e.target.checked)
                  }
                />
              </td>
              <td>{position.relationships.chain.data.id}</td>
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
      <button onClick={handleConfirmSelection}>Confirm Selection</button>
    </>
  );
};
