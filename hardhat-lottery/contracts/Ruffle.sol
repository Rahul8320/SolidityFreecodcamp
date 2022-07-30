// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Ruffle__NotEnoughETH();
error Ruffle__TransferFailed();
error Ruffle__NotOpen();
error Ruffle__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 ruffleState
);

/**@title A sample Raffle Contract
 * @author R. Dey.
 * @notice This contract is for creating a sample raffle contract
 * @dev This implements the Chainlink VRF Version 2
 */

contract Ruffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* Type declarations */
    enum RuffleState {
        OPEN,
        CALCULATING
    }

    /* State variables */
    // Chainlink VRF Variables
    uint256 private immutable i_entranceFee;
    address private immutable i_owner;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLine;
    uint16 private constant REQUEST_CONFORMATION = 3;
    uint32 private immutable i_callBackGasLimit;
    uint32 private constant NUM_WORDS = 1;
    uint64 private immutable i_subscriptionId;

    // Lottery Variables
    address private s_recentWinner;
    RuffleState private s_ruffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_timeInterval;

    /* events */
    event RuffleEnter(address indexed player);
    event RequestedRuffleWinner(uint256 indexed requestID);
    event WinnerPicked(address recentWinner);

    /* Functions */
    constructor(
        address vrfCoordinatorV2,
        uint256 _entranceFee,
        bytes32 gasLine,
        uint32 callBackGasLimit,
        uint64 subscriptionId,
        uint256 timeInterval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = _entranceFee;
        i_owner = msg.sender;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLine = gasLine;
        i_callBackGasLimit = callBackGasLimit;
        i_subscriptionId = subscriptionId;
        s_ruffleState = RuffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_timeInterval = timeInterval;
    }

    function enterRuffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Ruffle__NotEnoughETH();
        }
        if (s_ruffleState != RuffleState.OPEN) {
            revert Ruffle__NotOpen();
        }
        s_players.push(payable(msg.sender));
        // Emit an event when we update a dynamic array or mapping
        emit RuffleEnter(msg.sender);
    }

    /**
     * @dev This is the function that the Chainlink Keeper nodes call
     * they look for `upkeepNeeded` to return True.
     * the following should be true for this to return true:
     * 1. The time interval has passed between raffle runs.
     * 2. The lottery is open.
     * 3. The contract has ETH.
     * 4. Implicity, your subscription is funded with LINK.
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        override
        returns (
            bool upkeepNeeded,
            bytes memory /*performData*/
        )
    {
        bool isOpen = (RuffleState.OPEN == s_ruffleState);
        bool timePassed = ((block.timestamp - s_lastTimeStamp) >
            i_timeInterval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = (address(this).balance > 0);
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);
    }

    /**
     * @dev Once `checkUpkeep` is returning `true`, this function is called
     * and it kicks off a Chainlink VRF call to get a random winner.
     */
    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert Ruffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_ruffleState)
            );
        }
        s_ruffleState = RuffleState.CALCULATING;
        uint256 requestID = i_vrfCoordinator.requestRandomWords(
            i_gasLine,
            i_subscriptionId,
            REQUEST_CONFORMATION,
            i_callBackGasLimit,
            NUM_WORDS
        );
        emit RequestedRuffleWinner(requestID);
    }

    /**
     * @dev This is the function that Chainlink VRF node
     * calls to send the money to the random winner.
     */
    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        s_players = new address payable[](0);
        s_ruffleState = RuffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        if (!success) {
            revert Ruffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    /** Getter Functions */
    
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getPlayer(uint256 _index) public view returns (address) {
        return s_players[_index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRuffleState() public view returns (RuffleState) {
        return s_ruffleState;
    }

    function getTotalPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getTimeInterval() public view returns (uint256) {
        return i_timeInterval;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequestConfirmation() public pure returns (uint256) {
        return REQUEST_CONFORMATION;
    }
}
