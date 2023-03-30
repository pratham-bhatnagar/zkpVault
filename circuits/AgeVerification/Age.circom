pragma circom 2.0.6;

include "../circomlib/comparators.circom";

template AgeVerification() {
    signal input min_age;
    signal input age;
    signal output out;

    // Adding Comarators component with maximum value 2^45
    component gte = GreaterEqThan(45);
    gte.in[0] <== age; 
    gte.in[1] <== min_age;
    // gte.in[0] > gte.in[1] should be true i.e 1
    gte.out === 1;

    out <== gte.out;
 }

 component main { public [ min_age] } = AgeVerification();
