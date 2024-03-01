// START OF ZERION RESPONSE INTERFACES -------------------------
// Success response for chains (HTTP 200)
interface Icon {
  url: string;
}

interface Flags {
  verified: boolean;
}

interface Implementation {
  chain_id: string;
  address: string | null;
  decimals: number;
}

interface FungibleInfo {
  name: string;
  symbol: string;
  icon: Icon | null;
  flags: Flags;
  implementations: Implementation[];
}

interface Quantity {
  int: string;
  decimals: number;
  float: number;
  numeric: string;
}

interface Changes {
  absolute_1d: number | null;
  percent_1d: number | null;
}

interface Attributes {
  parent: string | null;
  protocol: string | null;
  name: string;
  position_type: string;
  quantity: Quantity;
  value: number | null;
  price: number;
  changes: Changes | null;
  fungible_info: FungibleInfo;
  flags: Flags;
  updated_at: string;
  updated_at_block: number;
}

interface RelatedData {
  type: string;
  id: string;
}

interface RelatedLinks {
  related: string;
}

interface Relationship {
  links: RelatedLinks;
  data: RelatedData;
}

interface Relationships {
  chain: Relationship;
  fungible: Relationship;
}

export interface Position {
  type: string;
  id: string;
  attributes: Attributes;
  relationships: Relationships;
}

interface SelfLink {
  self: string;
}

export interface PortfolioResponse {
  links: SelfLink;
  data: Position[];
}

// Error responses for various HTTP status codes (400, 401, 429)
interface ErrorDetail {
  title: string;
  detail: string;
}
export interface ErrorResponse {
  errors: ErrorDetail[];
}

// END OF ZERION RESPONSE INTERFACES -------------------------
