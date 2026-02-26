// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StackWaveToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    constructor() 
        ERC20("StackWave", "SWAVE") 
        ERC20Permit("StackWave") 
        Ownable(msg.sender)
    {
        _mint(msg.sender, 1000000000 * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}

contract StackWavePayments is Ownable {
    constructor() Ownable(msg.sender) {}

    receive() external payable {}
    fallback() external payable {}

    function pay() external payable {}

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract StackWaveStaking {
    IERC20 public token;
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;

    constructor(address _token) {
        token = IERC20(_token);
    }

    function stake(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        stakes[msg.sender] += amount;
    }

    function claim() external {
        uint256 reward = stakes[msg.sender] / 10;
        require(reward > 0, "No rewards");
        require(token.transfer(msg.sender, reward), "Reward transfer failed");
    }
}
