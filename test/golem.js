var GolemToken = artifacts.require("./GolemNetworkToken.sol");
var MigrationAgent  = artifacts.require("./MigrationAgent.sol");
var TargetToken  = artifacts.require("./GNTTargetToken.sol");


contract('Golem Migration', function(accounts) {

  let UNIT = web3.toWei(1, "ether");
  let migrationMaster = accounts[2];
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
    console.log("Minting cost: " + gasUsed);
    let total = await token.totalSupply.call();
    assert.equal(total.valueOf(), UNIT * 1000, "Total supply is different than 1000");
    let balance = await token.balanceOf(holder);
    assert.equal(balance.valueOf(), UNIT * 1000, "Holder balance is different than 1000");
  });

  it("should finalize sale", async function () {
    await token.finalize();
  });

  it("should transfer tokens", async function () {
    let tx = await token.transfer(receiver, 1000 * UNIT, {from : holder});
    let gasUsed = tx.receipt.gasUsed;
    console.log("Transfer cost: " + gasUsed);
    let holderBalance = await token.balanceOf(holder);
    assert.equal(holderBalance.valueOf(), 0, "Holder balance is different than 0");
  });

  it("should setup migration", async function () {
    let migration = await MigrationAgent.new(token.address);
    let receiptMigration = await web3.eth.getTransactionReceipt(migration.transactionHash);
    await token.setMigrationAgent(migration.address, {from: migrationMaster});
    let targetToken = await TargetToken.new(migration.address);
    let receiptNewToken = await web3.eth.getTransactionReceipt(targetToken.transactionHash);
    console.log("Migration one-off cost: " + (receiptMigration.gasUsed + receiptNewToken.gasUsed));
    await migration.setTargetToken(targetToken.address);
  });

  it("should migrate", async function () {
    let tx = await token.migrate(1000 * UNIT, {from: receiver});
    let gasUsed = tx.receipt.gasUsed;
    console.log("Migration cost per account: " + gasUsed);
  });

});