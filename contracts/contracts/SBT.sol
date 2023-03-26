// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./utils/Ownable.sol";

interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) external view returns (bool);
}

contract zkVault is Ownable {
    string public _name;

    string public _symbol;

    uint256 public _totalSBT;

    mapping(address => Proof) private souls;

    event Mint(address _soul);
    event Burn(address _soul);
    event Update(address _soul);

    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256[2] input;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Not valid address");
        _;
    }

    constructor() {
        _name = "zkVault";
        _symbol = "ZKV";
        _totalSBT = 0;
    }

    function mint(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) external virtual {
        require(!hasSoul(msg.sender), "Soul already exists");
        Proof memory _soulData = Proof(a, b, c, input);
        souls[msg.sender] = _soulData;
        _totalSBT++;
        emit Mint(msg.sender);
    }

    function burn(address _soul)
        external
        virtual
        onlyOwner
        validAddress(_soul)
    {
        require(hasSoul(_soul), "Soul does not exists");
        delete souls[_soul];
        _totalSBT--;
        emit Burn(_soul);
    }

    function updateSBT(address _soul, Proof memory _soulData)
        public
        validAddress(_soul)
        returns (bool)
    {
        require(hasSoul(_soul), "Soul does not exist");
        souls[_soul] = _soulData;
        emit Update(_soul);
        return true;
    }

    function getSBTData(address _soul)
        public
        view
        virtual
        validAddress(_soul)
        returns (
            uint256[2] memory,
            uint256[2][2] memory,
            uint256[2] memory,
            uint256[2] memory
        )
    {
        return (
            souls[_soul].a,
            souls[_soul].b,
            souls[_soul].c,
            souls[_soul].input
        );
    }

    function validateAttribute(address _soul, address verifierAddress)
        public
        view
        returns (bool)
    {
        require(hasSoul(_soul), "Soul does not exist");

        Proof memory _soulData = souls[_soul];
        IVerifier verifier = IVerifier(verifierAddress);
        return
            verifier.verifyProof(
                _soulData.a,
                _soulData.b,
                _soulData.c,
                _soulData.input
            ); // Using zkSNARK verification
    }

    function totalSBT() public view virtual returns (uint256) {
        return _totalSBT;
    }

    function hasSoul(address _soul)
        public
        view
        virtual
        validAddress(_soul)
        returns (bool)
    {
        return souls[_soul].input[0] != 0;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }
}
