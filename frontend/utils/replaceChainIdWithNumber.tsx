export function replaceChainIdWithNumber(
  array: { address: string; chainId: string }[],
  chainIdMap: { [key: string]: number }
): { address: string; chainId: number }[] {
  return array.map((item) => ({
    address: item.address,
    // Use the chainId from the map, or if it's not found, use the original chainId string converted to a number
    chainId: chainIdMap[item.chainId] || Number(item.chainId),
  }));
}
