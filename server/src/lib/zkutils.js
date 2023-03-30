import * as snarkjs from "snarkjs";
import {
  wrongProof,
  wrongPublicSignals,
} from "../public/creditScoreWrongProof.js";

const CreditScoreWasmPath = "./src/public/creditScoreCircuit.wasm";
const CreditScoreFinalZkeyPath = "./src/public/creditScoreCircuit_0001.zkey";
const TwitterWasmPath = "././src/public/TwitterFollower.wasm";
const TwitterFinalZkeyPath = "./src/public/Twittercircuit_0001.zkey";
const AgeWasmPath = "./src/public/Age.wasm";
const AgeFinalZkeyPath = "./src/public/age_0001.zkey";

export async function generateCallDataAge(age) {
  try {
    console.log("Generating Proofs...");
    const { proof, publicSignals } = await generateProofAge(age);
    console.log(proof);
    console.log("Generating call data...");
    const calldata = await snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals
    );
    const argv = calldata
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());
    console.log("ARGV", calldata);
    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = [];

    for (let i = 8; i < argv.length; i++) {
      Input.push(argv[i]);
    }

    return { a, b, c, Input };
  } catch (error) {
    console.log("Error during exportSolidityCallData");
    console.log(`Error Message ${error.message}`);
    return null;
  }
}

export async function generateProofAge(age) {
  try {
    const inputSignal = {
      min_age: 18,
      age: age,
    };
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputSignal,
      AgeWasmPath,
      AgeFinalZkeyPath
    );
    return { proof, publicSignals };
  } catch (error) {
    // check if it returns Error: Assert Failed.
    if (error.message.includes("Assert Failed")) {
      return { proof: wrongProof, publicSignals: wrongPublicSignals };
    }
  }
}

export async function generateCallDataCredit(creditScore) {
  try {
    console.log("Generating Proofs...");
    const { proof, publicSignals } = await generateProofCredit(creditScore);
    console.log(proof);
    console.log("Generating call data...");
    const calldata = await snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals
    );
    const argv = calldata
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());
    console.log("ARGV", calldata);
    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = [];

    for (let i = 8; i < argv.length; i++) {
      Input.push(argv[i]);
    }

    return { a, b, c, Input };
  } catch (error) {
    console.log("Error during exportSolidityCallData");
    console.log(`Error Message ${error.message}`);
    return null;
  }
}

export async function generateProofCredit(creditScore) {
  try {
    const inputSignal = {
      threshold: 25,
      credit_score: creditScore,
    };
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputSignal,
      CreditScoreWasmPath,
      CreditScoreFinalZkeyPath
    );
    return { proof, publicSignals };
  } catch (error) {
    // check if it returns Error: Assert Failed.
    if (error.message.includes("Assert Failed")) {
      return { proof: wrongProof, publicSignals: wrongPublicSignals };
    }
  }
}

// Twitter

export async function generateCallDataTwitter(followers, threshold) {
  try {
    console.log("Generating Proofs...");
    const { proof, publicSignals } = await generateProofTwitter(
      followers,
      threshold
    );
    console.log(proof);
    console.log("Generating call data...");
    const calldata = await snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals
    );
    const argv = calldata
      .replace(/["[\]\s]/g, "")
      .split(",")
      .map((x) => BigInt(x).toString());
    console.log("ARGV", calldata);
    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = [];

    for (let i = 8; i < argv.length; i++) {
      Input.push(argv[i]);
    }

    return { a, b, c, Input };
  } catch (error) {
    console.log("Error during exportSolidityCallData");
    console.log(`Error Message ${error.message}`);
    return null;
  }
}

export async function generateProofTwitter(followers, threshold) {
  try {
    const inputSignal = {
      threshold_followers: threshold,
      user_followers: followers,
    };
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputSignal,
      TwitterWasmPath,
      TwitterFinalZkeyPath
    );
    return { proof, publicSignals };
  } catch (error) {
    // check if it returns Error: Assert Failed.
    if (error.message.includes("Assert Failed")) {
      return { proof: wrongProof, publicSignals: wrongPublicSignals };
    }
  }
}
