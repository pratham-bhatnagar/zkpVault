import { ConnectKitButton } from "connectkit"

const Navbar = ()=>{
return <div className=" flex justify-between w-full items-center bg-white p-2 border-2 border-[#f9f9f9]">
  <p className="text-3xl text-blue-500 font-bold">zkpVault </p>
  <div className="flex gap-8 text-lg font-bold  ">
  <a href="/proofs"><p className="hover:underline cursor-pointer">Generate Proofs</p></a>  
   <a href="/myproofs"> <p className="hover:underline cursor-pointer">My Proofs</p></a>
  </div>
    <ConnectKitButton/>
</div>

}
export default Navbar