import Navbar from "../components/navbar";

const Main = () => {
  return (
    <div className="h-[100vh] w-full bg-[url('https://img.freepik.com/free-vector/white-background-with-zigzag-pattern-design_1017-33197.jpg')]">
      <Navbar />

      <p className="text-8xl text-center mt-[10vh] font-bold p-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400  ">
        {" "}
        Tokenize your Identity
      </p>
      <p className="text-center px-[15vw] font-medium text-lg text-[#191919] mt-[20px]">
        Interact with internet without worring about your Data, Proofs are
        non-transferable tokens (SBTs) that represent verifiable claims
        authenticated by ZKVault. <br />
        <br /> When minting a Proof, a user generates a proof to authenticate an
        anonymized verifiable claim about some data that only they own. Then
        using snarkjs and Groth16 a proof is generated and proof is then
        verified and tokenized as a SBT by zkpVault—smart contracts that convert
        proven data into non-transferable tokens (SBTs) As SBT are issued as
        tokens on-chain, they are compatible with the burgeoning ecosystem of
        web3 applications.As such, Badges represent verified acts about a user’s
        digital identity. For example, a user could have a ZK SBT proving they
        have a certain threshold of Twitter followers
      </p>
      <div
        className="flex justify-center mt-[10vh] gap-4
      "
      >
       <a href="/proofs"> <button className=" w-[170px]  py-3 bg-[#191919] text-white rounded-md font-semibold">
          Mint your own SBT
        </button></a>

        <a href="https://zkp-vault-demo.vercel.app/"><button className=" w-[170px]  py-3 bg-[#191919] text-white rounded-md font-semibold">
          Demo App ↗
        </button></a>
      </div>
    </div>
  );
};

export default Main;
