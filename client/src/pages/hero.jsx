const Hero = () => {
  return (
    <div className="h-[100vh] w-full bg-[url('https://img.freepik.com/free-vector/white-background-with-zigzag-pattern-design_1017-33197.jpg')]">
      <div className="p-3 px-[8vw] flex justify-between">
        <p className="text-3xl text-blue-500 font-bold">zkpVault </p>
        <a href="/main">
          {" "}
          <button className=" px-3 py-2 bg-[#191919] text-white rounded-md font-semibold">
            Launch App
          </button>
        </a>
      </div>
      <div className="p-[10vh] flex-row items-center justify-center text-center">
        <p className="text-8xl   font-extrabold">
          <div className=" bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400 ">
            Privacy-Preserved
          </div>{" "}
          Onchain Identity
        </p>
        <p className="px-[10vw] font-medium text-lg text-[#191919] mt-[20px]">
          Introducing zkpVault - the ultimate solution for secure and private
          online interactions. zkpVault is a zero-knowledge-powered proof
          aggregator that enables users to prove their identity and credentials
          without revealing any unnecessary personal information. It's a
          game-changing technology that has the potential to revolutionize how
          we interact with online services and protect our privacy.
        </p>
      </div>
      <div
        className="flex justify-center gap-4
      "
      >
        <button className=" w-[150px]  py-3 bg-[#191919] text-white rounded-md font-semibold">
          Github
        </button>

        <button className=" w-[150px]  py-3 bg-[#191919] text-white rounded-md font-semibold">
          Devfolio
        </button>
      </div>
    </div>
  );
};

export default Hero;
