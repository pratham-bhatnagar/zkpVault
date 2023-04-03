
circom Lens.circom --r1cs --wasm --sym --c

if [[ $* == *--nodejs* ]] 
then
    echo "Using nodejs \n" 
    cd circuit_js 
    node generate_witness.js Lens.wasm ../input.json witness.wtns
else
    echo "Using cpp" # Faster for larger circuits
    cd circuit_cpp # Make to compile the cpp code that generates witness
    make
    ./generate_witness ../input.json witness.wtns
fi

cp witness.wtns ../witness.wtns
cd ..

# Use snarkjs to generate and validate proof

# 1. Starting Powers of Tau Ceremony
# The groth16 zk-snark protocol requires a trusted setup to be able to generate a proof.

# The following ceremony is used to generate a trusted setup.

# create powers of tau ceremony
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v

# Contribute to the created ceremony
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="zkpVault" -v -e="random text"

# 2. Phase 2 of POT
# Prepare for the start of phase 2
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

# Generate zKey file that contains the proving and verification keys together with phase 2 contributions
snarkjs groth16 setup Lens.r1cs pot12_final.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey circuit_0001.zkey --name="1st Contributor Name" -v -e="random text"

# Export verification key to json file
snarkjs zkey export verificationkey circuit_0001.zkey verification_key.json

# Generate a zero knowledge proof using zkey and witness
# This outputs a proof file and a public file containing public inputs and outputs (proving key)
snarkjs groth16 prove circuit_0001.zkey witness.wtns proof.json public.json

# Use the verification key, proof and public file to verify the proof
snarkjs groth16 verify verification_key.json public.json proof.json


# generate solidity code
snarkjs zkey export solidityverifier circuit_0001.zkey Verifier.sol

# generate and print parameters of call
# snarkjs generatecall | tee parameters.txt
# snarkjs generatecall --proof proof.json --pub pub.json