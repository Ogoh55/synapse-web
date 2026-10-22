/**
 * Typed registry of predefined Soroban RPC environments.
 *
 * A custom endpoint can be supplied at runtime in addition to these entries.
 * The interactive switcher UI is built on top of this registry; keeping the
 * environment list here means the network metadata is defined in one place.
 */
export interface SorobanEnvironment {
  name: string;
  rpcUrl: string;
  networkPassphrase: string;
}

export type NetworkKey = "testnet" | "futurenet" | "custom";

export interface NetworkOption {
  key: NetworkKey;
  label: string;
}

export const PREDEFINED_ENVIRONMENTS: SorobanEnvironment[] = [
  {
    name: "Testnet",
    rpcUrl: "https://soroban-testnet.stellar.org",
    networkPassphrase: "Test SDF Network ; September 2015",
  },
  {
    name: "Futurenet",
    rpcUrl: "https://rpc-futurenet.stellar.org",
    networkPassphrase: "Test SDF Future Network ; October 2022",
  },
];

export const PREDEFINED_NETWORKS: NetworkOption[] = [
  {
    key: "testnet",
    label: "Testnet",
  },
  {
    key: "futurenet",
    label: "Futurenet",
  },
];
