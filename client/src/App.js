import React from "react";
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { polygon, polygonMumbai, goerli, sepolia } from "wagmi/chains";
import Hero from "./pages/hero";
import Proofs from "./pages/proofs";
import Navbar from "./components/navbar";

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
      <ConnectKitProvider theme="nouns"
        customTheme={{
          "--ck-accent-color": "#58ADF7",
          "--ck-accent-text-color": "#ffffff",
          "--ck-border-radius": 42,
        }}
      >
  
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Hero />}></Route>
            <Route path="/proofs" element={<Proofs/>} />
          </Routes>
        </BrowserRouter>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
