var MiniMeTokenFactory = artifacts.require("./MiniMeTokenFactory.sol");
var MiniMeToken = artifacts.require("./MiniMeToken.sol");
var Campaign = artifacts.require("./Campaign.sol");

module.exports = function(deployer, network, accounts) {
  var now = new Date().getTime();
  deployer.deploy(MiniMeTokenFactory).then(function() {
    return deployer.deploy(MiniMeToken, MiniMeTokenFactory.address, "0x0", 0, "Test", 18, "T", true);
  }).then(function() {
    return deployer.deploy(Campaign, now, now + 10000, 10000, accounts[4], MiniMeToken.address);
  })

};
