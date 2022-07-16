// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

// import another contract
import "./SimpleStorage.sol";

contract StorageFactory {
    SimpleStorage[] public simpleStorageArray;

    // deploy another contract from this contract and put in into array
    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStore(uint _index, uint _number) public {
        simpleStorageArray[_index].store(_number);
    }

    function sfGet(uint _index) public view returns(uint) {
        return simpleStorageArray[_index].getFavNum();
    }

    function sfGetPeople(uint _index, uint _pos) public view returns(SimpleStorage.People memory) {
        return simpleStorageArray[_index].getPeople(_pos);
    }

    function sfAddPerson(uint _index, string memory _name, uint _number) public {
        simpleStorageArray[_index].addPerson(_number,_name);
    }

    function sfSearchName(uint _index, string memory _name) public view returns(uint) {
        return simpleStorageArray[_index].searchName(_name);
    }
}