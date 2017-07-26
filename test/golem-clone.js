var ClonableToken = artifacts.require("./ClonableToken.sol");
var CloningAgent  = artifacts.require("./CloningAgent.sol");
var TargetToken  = artifacts.require("./GNTTargetToken.sol");


contract('Golem Cloning', function(accounts) {

  let UNIT = web3.toWei(1, "ether");
  let migrationMaster = accounts[2];
  let holder = accounts[3];
  let receiver = accounts[4];
  var token;
  var clonedToken;
  var cloning;


  it("should deploy token with empty balance", async function () {
    token = await ClonableToken.deployed();
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
    let receiverBalance = await token.balanceOf(receiver);
    assert.equal(receiverBalance.valueOf(), 1000 * UNIT, "Incorrect receiver balance");

  });

  it("should setup cloning", async function () {
    cloning = await CloningAgent.new(token.address);
    let receiptCloning = await web3.eth.getTransactionReceipt(cloning.transactionHash);
    await token.setMigrationAgent(cloning.address, {from: migrationMaster});
    clonedToken = await TargetToken.new(cloning.address);
    let receiptNewToken = await web3.eth.getTransactionReceipt(clonedToken.transactionHash);
    console.log("Cloning one-off cost: " + (receiptCloning.gasUsed + receiptNewToken.gasUsed));
    await cloning.setTargetToken(clonedToken.address);
  });

  it("should clone", async function () {
    let tx = await token.clone(1000 * UNIT, {from: receiver});
    let gasUsed = tx.receipt.gasUsed;
    console.log("Cloning cost per account: " + gasUsed);
    let despositorBalance = await token.balanceOf(cloning.address);
    assert.equal(despositorBalance.valueOf(), 1000 * UNIT, "Incorrect deposit after cloning");
  });

  it("should collect deposit", async function () {
    await cloning.finalizeMigration();
    await token.collectDeposit({from: receiver});
    let originalBalance = await token.balanceOf(receiver);
    assert.equal(originalBalance.valueOf(), 1000 * UNIT, "Incorrect original token balance after cloning");
    let clonedBalance = await clonedToken.balanceOf(receiver);
    assert.equal(clonedBalance.valueOf(), 1000 * UNIT, "Incorrect cloned token balance after cloning");
  });

});