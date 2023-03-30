import Navbar from "../components/navbar";

const Main = () => {
  return (
    <div className="h-[100vh] w-full bg-[url('https://img.freepik.com/free-vector/white-background-with-zigzag-pattern-design_1017-33197.jpg')]">
      <Navbar />

      <p className="text-6xl text-center mt-[10vh] font-bold p-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400  ">
        {" "}
        Tokenize your Identity
      </p>
      <p className="text-center px-[10vw]"> </p>
      <p></p>
    </div>
  );
};

export default Main;
