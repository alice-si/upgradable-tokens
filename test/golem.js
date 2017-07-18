var GolemToken = artifacts.require("./GolemNetworkToken.sol");

contract('Golem Network Token', function(accounts) {

  it("should deploy token with empty balance", function () {
    return GolemToken.deployed().then(function (instance) {
      return instance.totalSupply.call();
    }).then(function (total) {
      assert.equal(total.valueOf(), 0, "Total supply is different than 0");
    });
  });

});