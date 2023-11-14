// SPDX-License-Identifier: Unlicensed
pragma solidity >0.7.0 <=0.9.0;

contract Session {
    address public user;
    address payable public tutor;
    string public query;
    uint256 public duration;
    uint256 public amount;
    string public fileURI;

    event payment(
        address indexed user,
        address indexed tutor,
        uint256 amount
    );

    constructor(
        address sessionUser,
        address payable sessionTutor,
        string memory sessionQuery,
        uint256 sessionDuration,
        uint256 sessionAmount,
        string memory sessionFileURI
    ) {
        user = sessionUser;
        tutor = payable(sessionTutor);
        query = sessionQuery;
        duration = sessionDuration;
        amount = sessionAmount;
        fileURI = sessionFileURI;
    }

    function makePayment() public payable {
        require(msg.sender == user, "Only the user can make the payment");
        require(msg.value >= amount, "Insufficient Ether sent");

        tutor.transfer(amount);

        emit payment(msg.sender, tutor, amount);
    }
}

contract SessionFactory {
    address[] public deployedSessions;

    event sessionCreated(
        address sessionAddress,
        address indexed user,
        address indexed tutor,
        string query,
        uint256 duration,
        uint256 amount,
        string fileURI
    );

    function createSession(
        address payable sessionTutor,
        string memory sessionQuery,
        uint256 sessionDuration,
        uint256 sessionAmount,
        string memory sessionFileURI
    ) public returns (address){
        Session newSession = new Session(
            msg.sender, 
            sessionTutor, 
            sessionQuery, 
            sessionDuration, 
            sessionAmount, 
            sessionFileURI
        );

        deployedSessions.push(address(newSession));

        emit sessionCreated(
            address(newSession), 
            msg.sender, 
            sessionTutor, 
            sessionQuery, 
            sessionDuration, 
            sessionAmount, 
            sessionFileURI
        );

        return address(newSession);
    }
}
