pragma circom 2.0.6;

include "../circomlib/comparators.circom";

template credit_score () {
    signal input threshold;
    signal input credit_score;
    signal output out;

    component gte = GreaterEqThan(9); 
    gte.in[0] <== credit_score;
    gte.in[1] <== threshold;
    gte.out === 1;

    out <== gte.out;
}

component main { public [ threshold  ] } = Demo();
