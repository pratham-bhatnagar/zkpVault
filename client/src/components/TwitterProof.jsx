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

const verifierContractAddress = "0x76AB06c228412d448d1bd1405a561fB30C6C47A0";

const zkpVaultContractConfig = {
  address: "0x2923fffc9ba79400F74A3a644D966370441eD653",
  abi: zkpVaultABI,
  chainId: 80001,
};

const TwitterFollowers = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const [proofStatus, setProofStatus] = React.useState(false);
  const [getFollowers, setFollowers] = React.useState("");
  const [getThreshold, setThreshold] = React.useState("");
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
    onError(err) {
      setVerificationStatus(false);
    },
    onSuccess(data) {
      setVerificationStatus(true);
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
    if (isNaN(parseInt(getFollowers)) && isNaN(parseInt(getThreshold))) {
      toast.error("Please enter a valid Followers");
      return;
    }
    if (hasSoul) {
      toast.error("Address already minted a SBT");
      return;
    }

    const callData = await getCallDataFromServer();
    setCallData(callData);
    if (Object.keys(getCallData).length !== 0) {
      mint?.();
    } else {
      toast("Genrated Proof", {
        icon: "🎉",
      });
      setProofStatus(true);
    }
  }

  function handleFollowersChange(e) {
    setFollowers(e.target.value);
  }
  function handleThresholdChange(e) {
    setThreshold(e.target.value);
  }

  const getCallDataFromServer = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/twitter/generate-call-data?followers=${getFollowers}&threshold=${getThreshold}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }, [getFollowers]);

//   React.useEffect(()=>{
//   toastOnTxn()
//   },[isMinted])

  React.useEffect(() => {
    if (hasSoul) {
      setHasSoul(true);
      setVerificationAddress(address);
    } else {
      setHasSoul(false);
    }
  }, [hasSoul]);

  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber());
    }
  }, [totalSupplyData]);

//   const toastOnTxn = ()=> toast.custom((t) => (
//     <div
//       className={`${
//         t.visible ? "animate-enter" : "animate-leave"
//       } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
//     >
//       <div className="flex-1 w-0 p-4">
//         <div className="flex items-start">
//           <div className="flex-shrink-0 pt-0.5">
//             <img
//               className="h-10 w-10 rounded-full"
//               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
//               alt=""
//             />
//           </div>
//           <div className="ml-3 flex-1">
//             <p className="text-sm font-medium text-gray-900">Polyscan</p>
//             <p className="mt-1 text-sm text-gray-500">
//               <a
//                 target="_blank"
//                 rel="noreferrer"
//                 href={`https://mumbai.polygonscan.com/tx/${mintData?.hash}`}
//               >
//                 View Transaction
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="flex border-l border-gray-200">
//         <button
//           onClick={() => toast.dismiss(t.id)}
//           className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   ));

  return (
    <>
      {" "}
      <div className="h-[650px] w-[25vw] rounded-md border border-blue-100 bg-blue-50 p-2 shadow-lg hover:shadow-xl ">
        <div>
          <Toaster />
        </div>

        <img
          className="h-[250px] object-cover rounded-md"
          src="./twitter-verified.webp"
        ></img>
        <h1 className="text-xl font-extrabold text-center pt-3 text-blue-800 ">
          Proof Of Followers
        </h1>
        <div className="p-3">
        {!hasSoul &&  <form className="h-[100px] items-center justify-center flex flex-col gap-4 contrast-more:border-slate-400 contrast-more:placeholder-slate-500">
            <input
              id="followers"
              type="number"
              className="outline-none  rounded-xl p-3 w-full"
              placeholder="Enter number of Followers"
              required
              value={getFollowers}
              onChange={handleFollowersChange}
            />
            <div className="flex gap-3 items-center" > <p className="font-bold">I have more than</p>  <input
              id="threshold"
              type="number"
              className=" outline-none   w-[88px] rounded-lg placeholder:italic p-1"
              placeholder="e.g : 100"
              required
              value={getThreshold}
              onChange={handleThresholdChange}
            /> <p className="font-bold"> follower(s)</p></div>
          
          </form>}

          <div className="flex mt-2 justify-center flex-col items-center">
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

            {mounted && isConnected && !isMinted && !hasSoul && (
              <button
                disabled={isMintLoading || isMintStarted}
                className="p-2 border bg-violet-200 border-blue-300 w-[200px]  transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110  duration-300 hover:shadow-lg rounded-md   m-4"
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => handleMintButtonClick()}
              >
                {isMintLoading && "Waiting for approval"}
                {isMintStarted && "Minting..."}
                {!isMintLoading && !isMintStarted && proofStatus && "Mint"}
                {!proofStatus && "Generate Proof 🎉"}
              </button>
            )}
          </div>
          <div className="flex mt-6 flex-col gap-2">
            <p className="font-bold text-xl">Status ℹ️ :</p>

            <div
              className={`flex rounded-xl font-semibold text-sm justify-between border ${
                hasSoul
                  ? `border-green-200 bg-green-100`
                  : `border-red-200 bg-red-100`
              }  p-4 items-center `}
            >
              <p>SBT </p>
              <p
                className={`${
                  hasSoul ? `bg-green-400` : `bg-red-400 text-white`
                }  rounded-full px-3 py-1`}
              >
                {hasSoul ? "Minted" : "Not Minted"}
              </p>
            </div>
            {hasSoul ? (
              <div
                className={`flex rounded-xl justify-between font-semibold text-sm border ${
                  getVerificationStatus
                    ? `border-green-200 bg-green-100`
                    : `border-red-200 bg-red-100`
                }  p-4 items-center `}
              >
                <p>Proof </p>
                <p
                  className={`${
                    getVerificationStatus ? `bg-green-400` : `bg-red-400 text-white`
                  }  rounded-full px-3 py-1`}
                >
                  {getVerificationStatus ? "Verified" : "Not Verified"}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>

          <p className="select-none italic opacity-80 mt-3  text-center text-xs font-semibold">
            {totalMinted} Proof of Followers ZK SBT minted so far!
          </p>
        </div>
      </div>
    </>
  );
};

export default TwitterFollowers;
