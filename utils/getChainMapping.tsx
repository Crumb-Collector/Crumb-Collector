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
