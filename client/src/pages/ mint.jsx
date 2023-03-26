import { ConnectKitButton } from "connectkit";
import {
  useAccount,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractWrite,
  useContractRead,useSigner,useProvider
} from "wagmi";
import React from "react";
import axios from "axios";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import zkpVaultABI from "../abi/zkpVault.json";


const verifierContractAddress = "0x2eDD5193F3bBdd2684Eff5C791BFADf40cD0912b";
const zkpVaultAddr = "0xC29Bd3440D2d5F95f615C666A960F17e0cD962b6"
const zkpVaultContractConfig = {
  address: "0xC29Bd3440D2d5F95f615C666A960F17e0cD962b6",
  abi: zkpVaultABI,
  chainId: 80001,
};

const Mint = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const [getProofStatus, setProofStatus] = React.useState(false);
  const [getCreditScore, setCreditScore] = React.useState("");
  const [getCallData, setCallData] = React.useState({});
  const [totalMinted, setTotalMinted] = React.useState(0);
  const [getHasSoul, setHasSoul] = React.useState(false);
  const [getVerificationAddress, setVerificationAddress] = React.useState("");
  const [getVerificationStatus, setVerificationStatus] = React.useState(null);

  const { data: signer } = useSigner();
  const provider = useProvider();

  const SBTContract = new ethers.Contract(
    zkpVaultAddr,
    zkpVaultABI,
    signer || undefined
  );

  // const fetchData = async () => {
  //   const totalSBTMinted = await SBTContract.totalSBT();
  //   setTotalMinted(totalSBTMinted);
  //   // {
  //   //   address && setHasSoulCC(await SBTContract.hasSoul(address));
  //   // }
  //   // console.log(getHasSoulCC);
  // };

  // React.useEffect(() => {
  //   fetchData();
  // }, []);

  const { data: totalSupplyData } = useContractRead({
    ...zkpVaultContractConfig,
    functionName: "totalSBT",
    watch: true,
    
  });

  const { data: hasSoul } = useContractRead({
    ...zkpVaultContractConfig,
    functionName: "hasSoul",
    watch: true,
    args: [address]
  });


  const { data: sbtData } = useContractRead({
    ...zkpVaultContractConfig,
    functionName: "getSBTData",
    watch: true,
    args: [address],
    onSuccess(data) {
      console.log("sbtdata", data);
    },
  });

  const { data: addressVerified } = useContractRead({
    ...zkpVaultContractConfig,
    functionName: "validateAttribute",
    watch: true,
    args: [getVerificationAddress, verifierContractAddress],
  });

  const { config: zkpVaultMintConfig } = usePrepareContractWrite({
    ...zkpVaultContractConfig,
    functionName: "mint",
    args: [getCallData.a, getCallData.b, getCallData.c, getCallData.Input],
  });

  const {
    data: mintData,
    write:mint,
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
      alert("Please enter a valid credit score");
      return;
    }
    if (hasSoul) {
      alert("Address already minted a SBT");
      return;
    }
    if (parseInt(getCreditScore) > 100) {
      alert("Credit Score cannot be greater than 100");
      return;
    }
    const callData = await getCallDataFromServer();
    setCallData(callData);

    console.log("getcallback cccc", callData);
    mintSbt();
  }

  const mintSbt =async () => {
    if (Object.keys(getCallData).length !== 0) {
      console.log("Call data generated", getCallData);
      mint?.()
      
    // const {hash} = await SBTContract.mint(getCallData.a,getCallData.b,getCallData.c,getCallData.inputs);
    //   console.log("mint data",hash)
      
      
    } else {
      alert("Proof is Being Geneatted !");
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
      return response.data
    } catch (error) {
      console.log(error);
      return {};
    }
  }, [getCreditScore]);

  // Helper
  const convertCallDataToIntegers = (responseData) => {
    console.log(responseData);
    const a = responseData.a.map((item) => new BigNumber(item));
    const b = responseData.b.map((item) => {
      return item.map((subItem) => new BigNumber(subItem));
    });
    const c = responseData.c.map((item) => new BigNumber(item));
    const inputs = responseData.Input.map((item) => parseInt(item));
    return { a, b, c, inputs };
  };

  React.useEffect(() => {
    if (hasSoul) {
      setHasSoul(true);
    } else {
      setHasSoul(false);
    }
  }, [hasSoul]);

  return (
    <div className="h-full p-4">
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
               {isMintLoading && 'Waiting for approval'}
                  {isMintStarted && 'Minting...'}
                  {!isMintLoading && !isMintStarted && 'Mint'}
            </button>
          )}
          {mounted && isConnected && isMinted && (
            <div>
              <p>Transaction Minted to</p>
              <a
                href={`https://goerli.etherscan.io/tx/${mintData?.hash}`}
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
  );
};

export default Mint;
