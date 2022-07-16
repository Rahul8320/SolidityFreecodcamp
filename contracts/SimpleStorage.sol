// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract SimpleStorage {
    // this is our favorite number default initialize to zero
    uint favNum;

    // create user defined data type struct
    struct People {
        uint num;
        string name;
    }

    People[] people; // create an array of struct
    // create an mapping -> name as key and num as value
    mapping(string => uint) nameToNum;
    // add People in the array as well as mapping
    function addPerson(uint _num, string memory _name) public {
        people.push(People(_num,_name));
        nameToNum[_name] = _num;
    }

    // make function virtual for override in another contract who inherite this contract
    function store(uint _fav) public virtual {
        favNum = _fav;
    }

    function getFavNum() public view returns(uint){
        return favNum;
    }

    //return one people
    function getPeople(uint _index) public view returns(People memory) {
        return people[_index];
    }

    // return favNum by name
    function searchName(string memory _name) public view returns(uint) {
        return nameToNum[_name];
    }
}