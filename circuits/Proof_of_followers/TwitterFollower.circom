pragma circom 2.0.6;

include "../circomlib/comparators.circom";

template Twitter_follower() {
    signal input threshold_followers;
    signal input user_followers;
    signal output out;

    // Adding Comarators component with maximum value 2^45
    component gte = GreaterEqThan(45);
    gte.in[0] <== user_followers; 
    gte.in[1] <== threshold_followers;
    // gte.in[0] > gte.in[1] should be true i.e 1
    gte.out === 1;

    out <== gte.out;
 }

 component main { public [ threshold_followers] } = Twitter_follower();
