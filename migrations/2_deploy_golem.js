var GolemToken = artifacts.require("./GolemNetworkToken.sol");

module.exports = function(deployer, network, accounts) {
  var currentBlock = web3.eth.blockNumber;
  deployer.deploy(GolemToken, accounts[1], accounts[2], currentBlock + 2, currentBlock + 10);
};
