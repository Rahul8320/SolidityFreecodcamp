// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

error DomainRegistration__DomainAlreadyRegister();
error DomainRegistration__DomainNotRegister();
error DomainRegistration__NotOwner();

contract DomainRegistration {
    
    address private immutable i_owner;
    mapping(string => address) private s_domainToAddress;
    mapping(string => bool) private s_checkAvalable;

    constructor () {
        i_owner = msg.sender;
    }

    function registerDomain(string memory _domain) public {
        if(s_checkAvalable[_domain]){
            revert DomainRegistration__DomainAlreadyRegister();
        }

        s_domainToAddress[_domain] = msg.sender;
        s_checkAvalable[_domain] = true;
    }

    function checkDomainAvalable(string memory _domain) public view returns(bool) {
        if(s_checkAvalable[_domain]){
            return false;
        }else{
            return true;
        }
    }

    function transferDomain(string memory _domain, address _to) public {
        if(!s_checkAvalable[_domain]) revert DomainRegistration__DomainNotRegister();
        if(s_domainToAddress[_domain] != msg.sender) revert DomainRegistration__NotOwner();

        s_domainToAddress[_domain] = _to;
    }

    function deleteDomain(string memory _domain) public {
        if(!s_checkAvalable[_domain]) revert DomainRegistration__DomainNotRegister();
        if(s_domainToAddress[_domain] != msg.sender) revert DomainRegistration__NotOwner();

        delete s_domainToAddress[_domain];
        s_checkAvalable[_domain] = false;
    }

    function lookupDomain(string memory _domain) public view returns(address) {
        return s_domainToAddress[_domain];
    }

    function getOwnerContract() public view returns(address) {
        return i_owner;
    }
}