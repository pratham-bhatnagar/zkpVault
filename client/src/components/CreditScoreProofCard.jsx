import { ConnectKitButton } from "connectkit";
import { Toaster, toast } from "react-hot-toast";
import {
  useAccount,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractWrite,
  useContractRead,
} from "wagmi";
import React from "react";
import axios from "axios";
import zkpVaultABI from "../abi/zkpVault.json";

const verifierContractAddress = "0x2eDD5193F3bBdd2684Eff5C791BFADf40cD0912b";

const zkpVaultContractConfig = {
  address: "0xC29Bd3440D2d5F95f615C666A960F17e0cD962b6",
  abi: zkpVaultABI,
  chainId: 80001,
};

const CreditScore = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const [proofStatus, setProofStatus] = React.useState(false);
  const [getCreditScore, setCreditScore] = React.useState("");
  const [getCallData, setCallData] = React.useState({});
  const [totalMinted, setTotalMinted] = React.useState(0);
  const [getHasSoul, setHasSoul] = React.useState(false);
  const [getVerificationAddress, setVerificationAddress] = React.useState("");
  const [getVerificationStatus, setVerificationStatus] = React.useState(null);

  const { data: totalSupplyData } = useContractRead({
    ...zkpVaultContractConfig,
    functionName: "totalSBT",
    watch: true,
  });

  const { data: hasSoul } = useContractRead({
    ...zkpVaultContractConfig,
    functionName: "hasSoul",
    watch: true,
    args: [address],
  });

  const { data: sbtData } = useContractRead({
    ...zkpVaultContractConfig,
    functionName: "getSBTData",
    watch: true,
    args: [address],
  });

  const { data: addressVerified } = useContractRead({
    ...zkpVaultContractConfig,
    functionName: "validateAttribute",
    watch: true,
    args: [getVerificationAddress, verifierContractAddress],
    onError(err){
console.log("Error Kuch is prakar hai ",err)
    },
    onSuccess(data) {
      console.log("verification Data", data);
    },
  });

  const { config: zkpVaultMintConfig } = usePrepareContractWrite({
    ...zkpVaultContractConfig,
    functionName: "mint",
    args: [getCallData.a, getCallData.b, getCallData.c, getCallData.Input],
  });

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(zkpVaultMintConfig);

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const isMinted = txSuccess;

  async function handleMintButtonClick() {
    if (isNaN(parseInt(getCreditScore))) {
      toast.error("Please enter a valid credit score");
      return;
    }
    if (hasSoul) {
      toast.error("Address already minted a SBT");
      return;
    }
    if (parseInt(getCreditScore) > 100) {
      toast.error("Credit Score cannot be greater than 100");
      return;
    }
    const callData = await getCallDataFromServer();
    setCallData(callData);

    console.log("getcallback cccc", callData);
    if (Object.keys(getCallData).length !== 0) {
      mint?.();
    } else {
      toast("Genrated Proof", {
        icon: "🎉",
      });
      setProofStatus(true);
      setVerificationAddress(address);
    }
  }

  function handleCreditScoreChange(e) {
    setCreditScore(e.target.value);
  }

  const getCallDataFromServer = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/credit/generate-call-data?creditScore=${getCreditScore}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }, [getCreditScore]);

  React.useEffect(() => {
    if (hasSoul) {
      setHasSoul(true);
    } else {
      setHasSoul(false);
    }
  }, [hasSoul]);

  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);

  return (
    <>
      {" "}
      <div className="h-full p-4 border border-black">
        <div>
          <Toaster />
        </div>
        <p>{totalMinted} ZK SoulBound Tokens minted so far!</p>
        <div className="flex justify-center">
          <ConnectKitButton />
        </div>
        <div>
          <h2>2. Mint zkSBT with credit score</h2>
          <form>
            <label className="font-light mt-5">Credit Score:</label>
            <input
              id="credit_score"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Input a credit score from 0 to 100"
              required
              value={getCreditScore}
              onChange={handleCreditScoreChange}
            />
          </form>
          <div style={{ padding: "12px 0px 12px 100px" }}>
            {mintError && (
              <p
                style={{ marginTop: 2, color: "#FF6257" }}
                className="overflow-x-auto"
              >
                Error: {mintError.message}
              </p>
            )}
            {txError && (
              <p
                style={{ marginTop: 2, color: "#FF6257" }}
                className="overflow-x-auto"
              >
                Error: {txError.message}
              </p>
            )}

            {mounted && isConnected && !isMinted && (
              <button
                style={{ marginTop: 2 }}
                disabled={isMintLoading || isMintStarted}
                className="button object-center"
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => handleMintButtonClick()}
              >
                {isMintLoading && "Waiting for approval"}
                {isMintStarted && "Minting..."}
                {!isMintLoading && !isMintStarted && proofStatus && "Mint"}
                {!proofStatus && "Generate Proof"}
              </button>
            )}
            {mounted && isConnected && isMinted && (
              <div>
                <p>Transaction Minted to</p>
                <a
                  href={`https://mumbai.polygonscan.com/tx/${mintData?.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {mintData?.hash.slice(0, 10)}...
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditScore;
