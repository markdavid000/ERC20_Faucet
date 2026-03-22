// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarkToken is ERC20, Ownable{
    event TokensClaimed(address indexed claimant, uint256 amount, uint256 nextClaimAt);
    event TokensMinted(address indexed to, uint256 amount, uint256 newTotalSupply);

    error CooldownNotElapsed(uint256 retryAt);
    error ExceedsMaxSupply(uint256 requested, uint256 available);
    error InvalidRecipient();
    error ZeroAmount();

    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18;
    uint256 public constant CLAIM_AMOUNT = 100 * 10**18;
    uint256 public constant COOLDOWN = 24 hours;

    mapping(address => uint256) public lastClaimed;

   constructor(uint256 initialSupply) ERC20("MarkToken", "MTK") Ownable(msg.sender) {
    if (initialSupply > 0) {
        if (initialSupply > MAX_SUPPLY) {
            revert ExceedsMaxSupply(initialSupply, MAX_SUPPLY);
        }
        _mint(msg.sender, initialSupply);
    }
}

    function requestToken() external {
        address claimant = msg.sender;
        uint256 last = lastClaimed[claimant];
        if(last != 0 && block.timestamp < last + COOLDOWN){
            revert CooldownNotElapsed(last + COOLDOWN);
        }

        uint256 available = MAX_SUPPLY - totalSupply();
        if(available < CLAIM_AMOUNT){
            revert ExceedsMaxSupply(CLAIM_AMOUNT, available);
        }
        lastClaimed[claimant] = block.timestamp;
        _mint(msg.sender, CLAIM_AMOUNT);

        emit TokensClaimed(claimant, CLAIM_AMOUNT, block.timestamp + COOLDOWN);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert InvalidRecipient();
        if (amount == 0) revert ZeroAmount();

        uint256 available = MAX_SUPPLY - totalSupply();

        if(amount > available){
            revert ExceedsMaxSupply(amount, available);
        }

        _mint(to, amount);

        emit TokensMinted(to, amount, totalSupply());
    }

}
