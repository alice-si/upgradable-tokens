pragma solidity ^0.4.10;

import "./ExampleMigration.sol";

contract CloningAgent is MigrationAgent {

  bool isFinalized;

  mapping (address => uint256) deposits;

  function CloningAgent(address _gntSourceToken) MigrationAgent(_gntSourceToken) {
  }

  //Interface implementation
  function migrateFrom(address _from, uint256 _value) {
    super.migrateFrom(_from, _value);

    //Register deposits (overflow check done in balance updating)
    deposits[_from] += _value;
  }

  function collectDeposit(address _from) {
    require(msg.sender == gntSourceToken);
    require(isFinalized);

    uint value = deposits[_from];
    require(value > 0);
    deposits[_from] = 0;

    Source.GolemNetworkToken(gntSourceToken).transfer(_from, value);
  }

  function finalizeMigration() {
    super.finalizeMigration();
    isFinalized = true;
  }

}
