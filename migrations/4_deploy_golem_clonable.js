var ClonableToken = artifacts.require("./ClonableToken.sol");

module.exports = function(deployer, network, accounts) {
  var currentBlock = web3.eth.blockNumber;
  deployer.deploy(ClonableToken, accounts[1], accounts[2], currentBlock + 2, currentBlock + 3, {gas: 2000000});
};
