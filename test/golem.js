var GolemToken = artifacts.require("./GolemNetworkToken.sol");
var Migration  = artifacts.require("./MigrationAgent.sol");


contract('Golem Network Token', function(accounts) {

  let UNIT = web3.toWei(1, "ether");
  let holder = accounts[3];
  let receiver = accounts[4];
  var token;


  it("should deploy token with empty balance", async function () {
    token = await GolemToken.deployed();
    let total = await token.totalSupply.call();
    assert.equal(total.valueOf(), 0, "Total supply before creation is different than 0");
  });

  it("should create tokens", async function () {
    let tx = await token.create({from : holder, to: token.address, value: UNIT});
    let gasUsed = tx.receipt.gasUsed;
    console.log("Creation cost: " + gasUsed);
    let total = await token.totalSupply.call();
    assert.equal(total.valueOf(), UNIT * 1000, "Total supply is different than 1000");
    let balance = await token.balanceOf(holder);
    assert.equal(balance.valueOf(), UNIT * 1000, "Holder balance is different than 1000");
  });

  it("should finalize sale", async function () {
    console.log(web3.eth.blockNumber);
    let tx = await token.finalize();
    let gasUsed = tx.receipt.gasUsed;
    console.log("Finalization cost: " + gasUsed);
  });

  it("should transfer tokens", async function () {
    let tx = await token.transfer(receiver, 1000 * UNIT, {from : holder});
    let gasUsed = tx.receipt.gasUsed;
    console.log("Transfer cost: " + gasUsed);
    let holderBalance = await token.balanceOf(holder);
    assert.equal(holderBalance.valueOf(), 0, "Holder balance is different than 0");
  });

});