var MiniMeToken = artifacts.require("./MiniMeToken.sol");
var Campaign = artifacts.require("./Campaign.sol");

contract('MiniMe Token', function(accounts) {

  let UNIT = web3.toWei(1, "ether");
  let migrationMaster = accounts[2];
  let holder = accounts[3];
  let receiver = accounts[4];
  var token;
  var campaign;
  var clone;

  it("should deploy token with empty balance", async function () {
    token = await MiniMeToken.deployed();
    campaign = await Campaign.deployed();
    token.changeController(campaign.address);

    let total = await token.totalSupply.call();
    assert.equal(total.valueOf(), 0, "Total supply before creation is different than 0");
  });

  it("should create tokens", async function () {
    //let tx = await token.p({from : holder, value: UNIT});
    let hash = await web3.eth.sendTransaction({from : holder, to: token.address, value: UNIT, gas: 1000000});
    let tx = web3.eth.getTransactionReceipt(hash)
    let gasUsed = tx.gasUsed;
    console.log("Minting cost: " + gasUsed);
    let total = await token.totalSupply.call();
    assert.equal(total.valueOf(), UNIT, "Total supply is different than 1 unit");
  });

  it("should transfer tokens 1.", async function () {
    let tx = await token.transfer(receiver, UNIT, {from : holder});
    let gasUsed = tx.receipt.gasUsed;
    console.log("1. transfer cost: " + gasUsed);
    let holderBalance = await token.balanceOf(holder);
    assert.equal(holderBalance.valueOf(), 0, "Holder balance is different than 0");
  });

  it("should transfer tokens 2.", async function () {
    let tx = await token.transfer(holder, UNIT, {from : receiver});
    let gasUsed = tx.receipt.gasUsed;
    console.log("2. transfer cost: " + gasUsed);
    let receiverBalance = await token.balanceOf(receiver);
    assert.equal(receiverBalance.valueOf(), 0, "Holder balance is different than 0");
  });

  it("should transfer tokens 3.", async function () {
    let tx = await token.transfer(receiver, UNIT, {from : holder});
    let gasUsed = tx.receipt.gasUsed;
    console.log("3. transfer cost: " + gasUsed);
    let holderBalance = await token.balanceOf(holder);
    assert.equal(holderBalance.valueOf(), 0, "Holder balance is different than 0");
  });

  it("should transfer tokens 4.", async function () {
    let tx = await token.transfer(holder, UNIT, {from : receiver});
    let gasUsed = tx.receipt.gasUsed;
    console.log("4. transfer cost: " + gasUsed);
    let receiverBalance = await token.balanceOf(receiver);
    assert.equal(receiverBalance.valueOf(), 0, "Holder balance is different than 0");
  });

  it("should clone token", async function () {
    let tx = await token.createCloneToken("CLONE", 18, "C", 0, true);
    let gasUsed = tx.receipt.gasUsed;
    console.log("Cloning one-off cost: " + gasUsed);
    clone = MiniMeToken.at(tx.logs[0].args._cloneToken);
    let total = await clone.totalSupply.call();
    assert.equal(total.valueOf(), UNIT, "Total supply is different than 1 unit");
  });

  it("should transfer tokens after clone 1.", async function () {
    let tx = await clone.transfer(receiver, UNIT, {from : holder});
    let gasUsed = tx.receipt.gasUsed;
    console.log("1. Transfer after clone cost: " + gasUsed);
    let holderBalance = await clone.balanceOf(holder);
    assert.equal(holderBalance.valueOf(), 0, "Holder balance is different than 0");
  });

  it("should transfer tokens after clone 2.", async function () {
    let tx = await clone.transfer(holder, UNIT, {from : receiver});
    let gasUsed = tx.receipt.gasUsed;
    console.log("2. Transfer after clone cost: " + gasUsed);
    let balance = await clone.balanceOf(receiver);
    assert.equal(balance.valueOf(), 0, "Holder balance is different than 0");
  });

  it("should transfer tokens after clone 3.", async function () {
    let tx = await clone.transfer(receiver, UNIT, {from : holder});
    let gasUsed = tx.receipt.gasUsed;
    console.log("3. Transfer after clone cost: " + gasUsed);
    let holderBalance = await clone.balanceOf(holder);
    assert.equal(holderBalance.valueOf(), 0, "Holder balance is different than 0");
  });

  it("should transfer tokens after clone 4.", async function () {
    let tx = await clone.transfer(holder, UNIT, {from : receiver});
    let gasUsed = tx.receipt.gasUsed;
    console.log("4. Transfer after clone cost: " + gasUsed);
    let balance = await clone.balanceOf(receiver);
    assert.equal(balance.valueOf(), 0, "Holder balance is different than 0");
  });

});