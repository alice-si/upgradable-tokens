var GolemToken = artifacts.require("./GolemNetworkToken.sol");

contract('Golem Network Token', function(accounts) {

  it("should deploy token with empty balance", async function () {
    let token = await GolemToken.deployed();
    let total = await token.totalSupply.call();
    assert.equal(total.valueOf(), 0, "Total supply is different than 0");
  });

});