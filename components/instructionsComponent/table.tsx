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
  Checkbox,
} from '@chakra-ui/react';
import { useAccount, useWriteContract } from 'wagmi';
import { formatHash } from '../../utils/utils';
import { Address, erc20Abi as abi } from 'viem'
import { useWaitForTransactionReceipt } from 'wagmi';

interface TableProps {
  portfolioData: PortfolioResponse;
  toAddress: Address
}

export const AssetAccordion: React.FC<TableProps> = ({
  portfolioData,
  toAddress
}) => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const { isConnecting, isDisconnected } = useAccount();

  // Group positions by chain ID
  var positionsByChain: Record<string, Position[]> = {};
  portfolioData.data.forEach((position) => {
    const { id } = position.relationships.chain.data;
    positionsByChain[id] = positionsByChain[id]
      ? [...positionsByChain[id], position]
      : [position];
  }, {});
  console.log('positionsByChain', positionsByChain);

  const handleRowSelectionChange = (
    chainId: string,
    positionId: string,
    isChecked: boolean
  ) => {
    setSelectedRowsByChain((prev) => ({
      ...prev,
      [chainId]: {
        ...(prev[chainId] || {}),
        [positionId]: isChecked,
      },
    }));
  };

  const [selectedRowsByChain, setSelectedRowsByChain] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const handleSelectAllChange = (chainId: string, isChecked: boolean) => {
    const newSelectedRowsForChain: Record<string, boolean> = {};
    positionsByChain[chainId].forEach((position: Position) => {
      newSelectedRowsForChain[position.id] = isChecked;
    });
    setSelectedRowsByChain((prev) => ({
      ...prev,
      [chainId]: newSelectedRowsForChain,
    }));
  };

  const getSelectAllState = (chainId: string) => {
    const positions = positionsByChain[chainId];
    const selectedRows = selectedRowsByChain[chainId] || {};
    const allChecked = positions.every((position) => selectedRows[position.id]);
    const isIndeterminate =
      positions.some((position) => selectedRows[position.id]) && !allChecked;
    return { allChecked, isIndeterminate };
  };

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const chainId = formData.get('chainId') as string
    // Ensure we're using the correct state to filter selected assets
    const selectedPositions = selectedRowsByChain[chainId] || {};
    const selectedAssets = Object.keys(selectedPositions)
      .filter((positionId) => selectedPositions[positionId])
      .map((positionId) => {
        const position = portfolioData.data.find((p) => p.id === positionId);
        return {
          chainId: position?.relationships?.chain?.data?.id ?? '',
          tokenAddress:
            position?.attributes?.fungible_info?.implementations[0]?.address ??
            'native-token',
          amount: position?.attributes?.quantity?.int ?? '0',
        };
      });

    console.log('selectedAssets', selectedAssets);
    selectedAssets.forEach((asset) => {
      console.log('send asset to:', toAddress, "asset:", asset);
      writeContract({
        address: asset.tokenAddress as Address,
        abi,
        functionName: 'transfer',
        args: [toAddress, BigInt(asset.amount)],
      })
    })
  }

  return (
    <Accordion allowToggle width="800px" m="20px">
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
            <form onSubmit={submit}>
              <Button
                mt={4}
                px={4}
                py={2}
                isDisabled={isConnecting || isDisconnected || isPending}
                type='submit'
              >
                {isConnecting || isDisconnected
                  ? 'CONNECT WALLET TO CONFIRM'
                  : isPending ? "tx pending" : `Send Tokens on ${chainId}`}
              </Button>
              <input type="hidden" name="chainId" value={chainId} />
            </form>
            <Table className={styles.asset_table}>
              <Thead>
                <Tr>
                  <Th width="14%">
                    {' '}
                    <Checkbox
                      isChecked={getSelectAllState(chainId).allChecked}
                      isIndeterminate={
                        getSelectAllState(chainId).isIndeterminate
                      }
                      onChange={(e) =>
                        handleSelectAllChange(chainId, e.target.checked)
                      }
                    >
                      Select
                    </Checkbox>
                  </Th>
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
                      <Checkbox
                        isChecked={
                          selectedRowsByChain[chainId]?.[position.id] || false
                        }
                        onChange={(e) =>
                          handleRowSelectionChange(
                            chainId,
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
                        ?.address
                        ? formatHash(
                          position.attributes.fungible_info.implementations[0]
                            .address
                        )
                        : 'N/A'}
                    </Td>
                    <Td>{position.attributes.value?.toFixed(2) || 'N/A'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
