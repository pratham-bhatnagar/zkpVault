import Navbar from "../components/navbar";
import zkpVaultABI from "../abi/zkpVault.json";
import React from "react";
import {
  useContractRead,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { toast, Toaster } from "react-hot-toast";

const MyProofs = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const { address } = useAccount();
  const [getHasSoulCredit, setHasSoulCredit] = React.useState(false);
  const [getHasSoulTwitter, setHasSoulTwitter] = React.useState(false);
  const [getHasSoulAge,setHasSoulAge] = React.useState(false);

  const zkpVaultContractConfigAge = {
    address: "0x8f017C15DE334adeCB03069F2533F1230617d2D0",
    abi: zkpVaultABI,
    chainId: 80001,
  };

  const zkpVaultContractConfigCredit = {
    address: "0x0E75923149e6857Dc596f1ade0E1919200973629",
    abi: zkpVaultABI,
    chainId: 80001,
  };

  const zkpVaultContractConfigTwitter = {
    address: "0x2923fffc9ba79400F74A3a644D966370441eD653",
    abi: zkpVaultABI,
    chainId: 80001,
  };

  const { data: sbtDataAge } = useContractRead({
    ...zkpVaultContractConfigAge,
    functionName: "getSBTData",
    watch: true,
    args: [address],
  });

  const { data: hasSoulAge } = useContractRead({
    ...zkpVaultContractConfigAge,
    functionName: "hasSoul",
    watch: true,
    args: [address],
  });



  const { data: sbtDataCredit } = useContractRead({
    ...zkpVaultContractConfigCredit,
    functionName: "getSBTData",
    watch: true,
    args: [address],
  });

  const { data: sbtDataTwitter } = useContractRead({
    ...zkpVaultContractConfigTwitter,
    functionName: "getSBTData",
    watch: true,
    args: [address],
  });

  const { data: hasSoulCredit } = useContractRead({
    ...zkpVaultContractConfigCredit,
    functionName: "hasSoul",
    watch: true,
    args: [address],
  });

  const { data: hasSoulTwitter } = useContractRead({
    ...zkpVaultContractConfigTwitter,
    functionName: "hasSoul",
    watch: true,
    args: [address],
  });

// Age Proof Burn

const { config: zkpVaultBurnAgeConfig } = usePrepareContractWrite({
  ...zkpVaultContractConfigAge,
  functionName: "burn",
  args: [address],
});

const {
  data: burnDataAge,
  write: burnAge,
  isLoading: isBurnAgeLoading,
  isSuccess: isBurnAgeStarted,
  error: burnErrorAge,
} = useContractWrite(zkpVaultBurnAgeConfig);


  // Credit Proof Burn
  const { config: zkpVaultBurnCreditConfig } = usePrepareContractWrite({
    ...zkpVaultContractConfigCredit,
    functionName: "burn",
    args: [address],
  });

  const {
    data: burnDataCredit,
    write: burnCredit,
    isLoading: isBurnCreditLoading,
    isSuccess: isBurnCreditStarted,
    error: burnErrorCredit,
  } = useContractWrite(zkpVaultBurnCreditConfig);

  // Twitter Proof Burn
  const { config: zkpVaultBurnTwitterConfig } = usePrepareContractWrite({
    ...zkpVaultContractConfigTwitter,
    functionName: "burn",
    args: [address],
  });

  const {
    data: burnData,
    write: burnTwitter,
    isLoading: isBurnTwitterLoading,
    isSuccess: isBurnTwitterStarted,
    error: burnError,
  } = useContractWrite(zkpVaultBurnTwitterConfig);

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: burnData?.hash,
  });


  const handleBurnCreditButton = ()=>{
    burnCredit?.();
  }

  const handleBurnTwitterButton = () => {
    burnTwitter?.();
  };

  React.useEffect(() => {
    if (hasSoulCredit) {
      setHasSoulCredit(true);
    } else {
      setHasSoulCredit(false);
    }
  }, [hasSoulCredit]);

  React.useEffect(() => {
    if (hasSoulTwitter) {
      setHasSoulTwitter(true);
    } else {
      setHasSoulTwitter(false);
    }
  }, [hasSoulTwitter]);
  return (
    <div className="h-[100vh] w-full bg-[url('https://img.freepik.com/free-vector/white-background-with-zigzag-pattern-design_1017-33197.jpg')]">
      <Toaster />
      <Navbar />
      <p className="flex justify-center mt-8   text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400">
        Your Proofs
      </p>
      <div className="flex flex-col gap-3 p-4 m-4 bg-violet-100  rounded-xl border border-violet-400">
        <div className="grid grid-cols-3 justify-items-center font-bold text-xl p-3 w-full ">
          <p>Proof</p>
          <p>Verification Key</p>
          <p>{" "} </p>
        </div>
        {!hasSoulCredit && !hasSoulTwitter &&
        <div className="w-full p-3 bg-violet-300 border border-violet-400 justify-items-cente rounded-xl">
<p className="text-center italic text-xl">No Proofs found. You can Generate Proof <a href="/proofs"> <span className="cursor-pointer font-semibold underline">here</span></a></p>
        </div>
        }
        {hasSoulCredit && (
          <div className="p-3 bg-violet-300 border border-violet-400 justify-items-center  grid grid-cols-3 rounded-xl ">
            <p className="w-fit text-xl font-bold">Proof of Credit 💸</p>
            <p
             className="cursor-pointer font-mono hover:underline font-bold"
              onClick={() => {
                navigator.clipboard.writeText(sbtDataCredit);
                toast("Copied to Clipboard", {
                  icon: "📋",
                });
              }}
            >
             Copy Verification Key
            </p>
            <button
              onClick={() => handleBurnCreditButton()}
              className="px-4 py-2 border border-red-500  w-fit  bg-red-400 text-white rounded-xl"
            >
              {isBurnCreditLoading && "Waiting for Approval"}
              {isBurnCreditStarted && "Burning..."}
              {!isBurnCreditLoading && !isBurnCreditStarted && "Burn SBT"}
            </button>
          </div>
        )}

        {hasSoulTwitter && (
          <div className="p-3 bg-violet-300 border border-violet-400 grid grid-cols-3 justify-items-center rounded-xl ">
            <p className="text-xl font-bold">Proof of Followers 👥</p>
            <p
             className="cursor-pointer font-mono hover:underline font-bold"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(sbtDataTwitter));
                toast("Copied to Clipboard", {
                  icon: "📋",
                });
              }}
            >
              Copy Verification Key
            </p>
            <button
              onClick={() => handleBurnTwitterButton()}
              className="px-4 py-2 border border-red-500  w-fit  bg-red-400 text-white rounded-xl"
            >
              {isBurnTwitterLoading && "Waiting for Approval"}
              {isBurnTwitterStarted && "Burning..."}
              {!isBurnTwitterLoading && !isBurnTwitterStarted && "Burn SBT"}
            </button>
          </div>
        )}

{hasSoulAge && (
          <div className="p-3 bg-violet-300 border border-violet-400 grid grid-cols-3 justify-items-center rounded-xl ">
            <p className="text-xl font-bold">Proof of Age 🔞</p>
            <p
             className="cursor-pointer font-mono hover:underline font-bold"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(sbtDataAge));
                toast("Copied to Clipboard", {
                  icon: "📋",
                });
              }}
            >
              Copy Verification Key
            </p>
            <button
              onClick={() => handleBurnTwitterButton()}
              className="px-4 py-2 border border-red-500  w-fit  bg-red-400 text-white rounded-xl"
            >
              {isBurnAgeLoading && "Waiting for Approval"}
              {isBurnAgeStarted && "Burning..."}
              {!isBurnAgeLoading && !isBurnAgeStarted && "Burn SBT"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyProofs;
