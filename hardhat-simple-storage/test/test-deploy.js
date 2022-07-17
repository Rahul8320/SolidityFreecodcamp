const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", () => {
  let simpleStorage, simpleStorageFactory;

  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should start with a favorite number of 0", async () => {
    const currentNumber = await simpleStorage.getFavNum();
    const expectedNum = "0";
    assert.equal(currentNumber.toString(), expectedNum);
  });

  it("Should update when we call store ", async () => {
    const expectedValue = "26";
    const txResponse = await simpleStorage.store(expectedValue);
    await txResponse.wait(1);
    const currentNumber = await simpleStorage.getFavNum();
    assert.equal(currentNumber.toString(), expectedValue);
  });

  it("Should add person with name and favorite number ", async () => {
    const number = "26";
    const name = "Rahul";
    const txResponse = await simpleStorage.addPerson(number, name);
    await txResponse.wait(1);
    const people = await simpleStorage.getPeople(0);
    assert(people);
  });

  it("Should find favorite number of people by name ", async () => {
    const number = "26";
    const name = "Rahul";
    const txResponse = await simpleStorage.addPerson(number, name);
    await txResponse.wait(1);
    const currentNum = await simpleStorage.searchName(name);
    assert.equal(currentNum.toString(), number);
  })
});
