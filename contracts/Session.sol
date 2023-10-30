// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Session {
    address public user;
    address payable public tutor;
    string public query;
    uint256 public duration;
    uint256 public amount;

    event SessionCreated(
        address indexed user,
        address indexed tutor,
        uint256 duration,
        uint256 amount
    );
    event PaymentReceived(
        address indexed user,
        address indexed tutor,
        uint256 amountPaid
    );

    constructor(
        address _user,
        address payable _tutor,
        string memory _query,
        uint256 _duration
    ) {
        require(_user != address(0), "Invalid user address");
        require(_tutor != address(0), "Invalid tutor address");
        require(bytes(_query).length > 0, "Query cannot be empty");
        require(_duration > 0, "Duration must be greater than zero");

        user = _user;
        tutor = _tutor;
        query = _query;
        duration = _duration;

        amount = _duration * 0.0002 ether;

        emit SessionCreated(_user, _tutor, _duration, amount);
    }

    function makePayment() public payable {
        require(msg.sender == user, "Only the user can make the payment");
        require(msg.value >= amount, "Insufficient Ether sent");

        tutor.transfer(amount);
        emit PaymentReceived(user, tutor, msg.value);
    }

    function checkBalanceSufficient() public view returns (bool) {
        return user.balance >= amount;
    }
}

contract SessionFactory {
    address[] public sessionContracts;

    event SessionContractCreated(
        address indexed sessionContract,
        address indexed user,
        address indexed tutor
    );

    function createSession(
        address payable _tutor,
        string memory _query,
        uint256 _duration
    ) public {
        require(_tutor != address(0), "Invalid tutor address");
        require(bytes(_query).length > 0, "Query cannot be empty");
        require(_duration > 0, "Duration must be greater than zero");

        Session newSession = new Session(msg.sender, _tutor, _query, _duration);
        sessionContracts.push(address(newSession));

        emit SessionContractCreated(address(newSession), msg.sender, _tutor);
    }

    function getSessionContracts() public view returns (address[] memory) {
        return sessionContracts;
    }
}