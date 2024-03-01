interface ChainData {
  data: Array<{
    type: string;
    id: string;
    attributes: {
      external_id: string;
      name: string;
      icon: { url: string };
      explorer: {
        name: string;
        token_url_format: string;
        tx_url_format: string;
        home_url: string;
      };
      rpc: { public_servers_url: string[] };
      flags: {
        supports_trading: boolean;
        supports_sending: boolean;
        supports_bridge: boolean;
      };
    };
    relationships: {
      native_fungible: {
        links: { related: string };
        data: { type: string; id: string };
      };
      wrapped_native_fungible: {
        links: { related: string };
        data: { type: string; id: string };
      };
    };
    links: { self: string };
  }>;
}

async function extractChainIdMapping(): Promise<Record<string, number>> {
  const idToExternalIdMap: Record<string, number> = {};

  //GET  ALL THAT DATA WE NEED TO CONVERT NAMES OF CHAINS TO CHAIN_IDS
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Basic ${process.env.NEXT_PUBLIC_ZERION_API_DEV_KEY}`,
    },
  };

  try {
    const response = await fetch('https://api.zerion.io/v1/chains/', options);
    const chainsData: ChainData = await response.json();

    chainsData.data.forEach((chain) => {
      const {
        id,
        attributes: { external_id },
      } = chain;
      const externalIdBase10 = parseInt(external_id, 16); // Convert hex to base 10
      idToExternalIdMap[id] = externalIdBase10;
    });
  } catch (err) {
    console.error(err);
  }

  return idToExternalIdMap;
}

// Example usage
export async function getChainMapping() {
  const chainIdMapping = await extractChainIdMapping();
  console.log(chainIdMapping);
}
