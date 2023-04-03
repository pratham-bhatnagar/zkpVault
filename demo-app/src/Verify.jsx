import { ConnectKitButton } from "connectkit";
import React from "react";
import { useAccount, useContractRead } from "wagmi";
import {
  verifierContractAddressAge,
  verifierContractAddressCredit,
  verifierContractAddressTwitter,
  zkpVaultContractConfigAge,
  zkpVaultContractConfigCredit,
  zkpVaultContractConfigTwitter,
} from "./public";

const Verify = () => {
  const { isConnected, address } = useAccount();
  const [verifiedAge, setVerifiedAge] = React.useState(false);
  const [verifiedCredit, setVerifiedCredit] = React.useState(false);
  const [verifiedTwitter, setVerifiedTwitter] = React.useState(false);
  const [getHasSoulTwitter, setHasSoulTwitter] = React.useState(false);
  const [getHasSoulCredit, setHasSoulCredit] = React.useState(false);
  const [getHasSoulAge, setHasSoulAge] = React.useState(false);

  const { data: hasSoulAge } = useContractRead({
    ...zkpVaultContractConfigAge,
    functionName: "hasSoul",
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


  const { data: addressVerifiedAge } = useContractRead({
    ...zkpVaultContractConfigAge,
    functionName: "validateAttribute",
    watch: true,
    args: [address, verifierContractAddressAge],
    onError(err) {
      setVerifiedAge(false);
      console.log("error sss",err)
    },
    onSuccess(data) {
      setVerifiedAge(true);
    },
  });

  const { data: addressVerifiedCredit } = useContractRead({
    ...zkpVaultContractConfigCredit,
    functionName: "validateAttribute",
    watch: true,
    args: [address, verifierContractAddressCredit],
    onError(err) {
      setVerifiedCredit(false);
      console.log("error sss",err)
    },
    onSuccess(data) {
      setVerifiedCredit(true);
    },
  });

  const { data: addressVerifiedTwitter } = useContractRead({
    ...zkpVaultContractConfigTwitter,
    functionName: "validateAttribute",
    watch: true,
    args: [address, verifierContractAddressTwitter],
    onError(err) {
      setVerifiedTwitter(false);
      console.log("error sss",err)
    },
    onSuccess(data) {
      setVerifiedTwitter(true);
    },
  });

  const handleTweet = () => {
    const tweetText = encodeURIComponent(
      "Wohhooo, I just tried zkpVault for prooving my eligiblity for zkPratham Coin 🤯. LFGGGG 🎉 @prrthamm @devfolio @ETHIndiaco"
    );
    const tweetUrl = "https://twitter.com/intent/tweet?text=" + tweetText;
    window.open(tweetUrl, "_blank");
  };

  React.useEffect(() => {
    if (hasSoulTwitter) {
      setHasSoulTwitter(true);
    } else {
      setHasSoulTwitter(false);
    }
  }, [hasSoulTwitter]);

  React.useEffect(() => {
    if (hasSoulCredit) {
      setHasSoulCredit(true);
    } else {
      setHasSoulCredit(false);
    }
  }, [hasSoulCredit]);

  React.useEffect(() => {
    if (hasSoulAge) {
      setHasSoulAge(true);
    } else {
      setHasSoulAge(false);
    }
  }, [hasSoulAge]);

  return (
    <div className="flex flex-col mx-[25vw] my-[100px] justify-center items-center p-2 rounded-lg border ">
      <p className="text-xl font-extrabold text-cyan-600 ">
        Here Comes another hyped Airdrop 🪂{" "}
      </p>
      <p className="m-5 text-2xl font-bold underline">Requirements 📝</p>
      <div className="flex w-full gap-3 p-3 justify-center items-center rounded-md bg-cyan-50 flex-col ">
        <div className="justify-between items-center flex w-full ">
          <p className="font-bold">- YOU ARE 18 OR ABOVE? </p>
          {verifiedAge && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-green-400 text-white">
              Verified
            </div>
          )}
          {!verifiedAge && isConnected && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-red-400 text-white">
              Not Verfied
            </div>
          )}
        </div>
        <div className="justify-between items-center flex w-full ">
          <p className="font-bold">- YOU HAVE MORE THEN 5000 FOLLOWERS? </p>
          {verifiedTwitter && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-green-400 text-white">
              Verified
            </div>
          )}
          {!verifiedTwitter && isConnected && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-red-400 text-white">
              Not Verfied
            </div>
          )}
        </div>

        <div className="justify-between items-center flex w-full ">
          <p className="font-bold">- YOU HAVE A CREDIT SCORE MORE THEN 25? </p>
          {verifiedCredit && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-green-400 text-white">
              Verified
            </div>
          )}
          {!verifiedCredit && isConnected && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-red-400 text-white">
              Not Verfied
            </div>
          )}
        </div>
        <ConnectKitButton />
        {!isConnected && (
          <p className="italic">
            ( Verify with one click, By Connecting your Wallet )
          </p>
        )}

        {isConnected &&
          (!verifiedAge || !verifiedCredit || !verifiedTwitter) && (
            <p className="font-extrabold">
              Sorry Boss, You're not eligible 🔞🥹
            </p>
          )}
        {isConnected && verifiedAge && verifiedCredit && verifiedTwitter && (
          <p className=" font-extrabold">
            {" "}
            LFGGGG.... You are eligible for the AIRDROP 🎉🎉🎉
          </p>
        )}
        {isConnected && verifiedAge && verifiedCredit && verifiedTwitter && (
          <button
            onClick={() => {handleTweet()}}
            className="px-6 py-1 flex gap-2 items-center rounded-full bg-[#02A9F5] text-white font-bold cursor-pointer"
          >
           <img className="w-[40px] h-[40px]" src="./twitter.svg"/>
            Tweet for Karma!!
          </button>
        )}
      </div>
    </div>
  );
};

export default Verify;
