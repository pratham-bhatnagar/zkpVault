import { WagmiConfig, createClient } from "wagmi";

import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { polygon, polygonMumbai, goerli, sepolia } from "wagmi/chains";
import Verify from "./Verify";

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
        theme="nouns"
        customTheme={{
          "--ck-accent-color": "#58ADF7",
          "--ck-accent-text-color": "#ffffff",
          "--ck-border-radius": 42,
        }}
      >
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-5xl px-4 mt-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400 font-extrabold">
            Prove Your on-chain Identity
          </p>
          <p className="text-center font-extrabold text-xl">
            Powered by zkpVault 🔐
          </p>
          <div className="mt-8"> </div>{" "}
        </div>
        <Verify />
        <div className="bottom-0 ">
          {" "}
          <p className="p-2 text-center  " >
            Made with Love ❤️ by{" "}
            < a className="underline" target="_blank" href="https://www.twitter.com/prrthamm">
              @prrthamm
            </a>
          </p>
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
