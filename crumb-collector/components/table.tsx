import { PortfolioResponse, Position } from '@/interfaces/interfaces';
import React from 'react';

interface TableProps {
  portfolioData: PortfolioResponse;
}

// TODO - Add select option that creates a data object of all tokens that we want to transfer.

export const AssetTable: React.FC<TableProps> = ({ portfolioData }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Chain ID</th>
          <th>Name</th>
          <th>Symbol</th>
          <th>Value (USD)</th>
        </tr>
      </thead>
      <tbody>
        {portfolioData.data.map((position: Position) => (
          <tr key={position.id}>
            <td>{position.relationships.chain.data.id}</td>
            <td>{position.attributes.fungible_info.name}</td>
            <td>{position.attributes.fungible_info.symbol}</td>
            <td>{position.attributes.value?.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
