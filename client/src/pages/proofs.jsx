import AgeVerification from "../components/AgeVerification";
import CreditScore from "../components/CreditScoreProofCard";
import Navbar from "../components/navbar";
import TwitterFollowers from "../components/TwitterProof";
const Proofs = () => {
  return (
    <div className="h-[100vh]  w-full bg-[url('https://img.freepik.com/premium-vector/seamless-pattern-abstract-background-with-futuristic-style-use-business-cover-banner_7505-1823.jpg')]">
      <Navbar />
      <p className="text-2xl p-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-purple-600 font-extrabold">
        Generate Proof
      </p>

      <div className="flex gap-4 flex-wrap items-center justify-center">
        <CreditScore />

        <TwitterFollowers />
        <AgeVerification />
      </div>
    </div>
  );
};

export default Proofs;
