pragma solidity ^0.4.10;

import "./Token.sol";

contract ICloningAgent {
  function collectDeposit(address _from);
}

contract ClonableToken is GolemNetworkToken {

  function ClonableToken(address _golemFactory,
                         address _migrationMaster,
                         uint256 _fundingStartBlock,
                         uint256 _fundingEndBlock)
    GolemNetworkToken(_golemFactory, _migrationMaster, _fundingStartBlock, _fundingEndBlock) {
  }

  function clone(uint256 _value) external {
    migrate(_value);

    // Put deposit on cloning contract
    balances[migrationAgent] += _value;
  }

  function collectDeposit() external {
    ICloningAgent(migrationAgent).collectDeposit(msg.sender);
  }

}