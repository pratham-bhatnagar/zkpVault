import * as snarkjs from "snarkjs";
import { wrongProof, wrongPublicSignals } from "../public/creditScoreWrongProof.js";

const CreditScoreWasmPath = './src/public/creditScoreCircuit.wasm'
const CreditScoreFinalZkeyPath = './src/public/creditScoreCircuit_0001.zkey'
const CreditScoreVerificationKeyPath = './src/public/creditScoreVerification_key.json'


export async function generateCallData(creditScore) {
    try {
        console.log("Generating Proofs...");
        const { proof, publicSignals } = await generateProof(creditScore);
        console.log(proof);
        console.log("Generating call data...");
        const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
        const argv = calldata
            .replace(/["[\]\s]/g, "")
            .split(",")
            .map((x) => BigInt(x).toString());
        console.log("ARGV",calldata)
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
    }
    catch (error) {
        console.log("Error during exportSolidityCallData");
        console.log(`Error Message ${error.message}`);
        return null;
    }
}

export async function generateProof(creditScore) {
    try {
        const inputSignal = {
            "threshold": 25,
            "credit_score": creditScore
        };
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            inputSignal,
            CreditScoreWasmPath,
            CreditScoreFinalZkeyPath
        );
        return { proof, publicSignals };
    }
    catch (error) {
        // check if it returns Error: Assert Failed.
        if (error.message.includes("Assert Failed")) {
            return { proof: wrongProof, publicSignals: wrongPublicSignals };
        }
    }
}

