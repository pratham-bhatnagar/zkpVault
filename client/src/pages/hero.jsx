const Hero = () => {
  return (
    <div className="h-full">
      <div className="p-3 px-[8vw] flex justify-between">
        <p className="text-3xl text-blue-500 font-bold">zkpVault </p>
        <button className=" px-3 py-2 bg-[#191919] text-white rounded-md font-semibold">
          Launch App
        </button>
      </div>
      <div className="p-[10vh] flex-row items-center justify-center text-center">
        <p className="text-8xl   font-extrabold">
          <div className=" bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400 ">
            Privacy-Preserved
          </div>{" "}
          Onchain Identity
        </p>
        <p className="px-[10vw] font-medium text-lg text-[#191919] mt-[20px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, ipsum minus magnam illo distinctio in sed similique ea quis atque dolore? Temporibus fuga, animi beatae possimus maxime distinctio voluptatibus numquam!</p>
      </div>
      <div className="flex justify-center gap-4
      ">
        <button className=" w-[150px]  py-3 bg-[#191919] text-white rounded-md font-semibold">Github</button>

        <button className=" w-[150px]  py-3 bg-[#191919] text-white rounded-md font-semibold">Devfolio</button>
      </div>
    </div>
  );
};

export default Hero;
