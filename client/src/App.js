import React from "react";
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { polygon, polygonMumbai, goerli, sepolia } from "wagmi/chains";
import Mint from "./pages/ mint";
import Hero from "./pages/hero";

const chains = [polygonMumbai, goerli, sepolia, polygon];
const client = createClient(
  getDefaultClient({
    appName: "zkVault",
    chains,
  })
);

function App() {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
      customTheme={{
        "--ck-accent-color": "#58ADF7",
        "--ck-accent-text-color": "#ffffff",
        "--ck-border-radius": 42,
      }}>
        <Hero />
        <Mint />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
