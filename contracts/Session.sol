// SPDX-License-Identifier: Unlicensed
pragma solidity >0.7.0 <=0.9.0;

contract SessionFactory {
    struct Session {
        uint256 id;
        address user;
        address payable tutor;
        string query;
        uint256 duration;
        uint256 amount;
        string fileURI;
        bool paid;
    }

    event SessionCreated(
        uint256 id
        );

    event SessionRetrieved(
        uint256 id,
        address indexed user,
        address indexed tutor,
        string query,
        uint256 duration,
        uint256 amount,
        string fileURI
    );

        event SessionEvent(
        uint256 id,
        address indexed user,
        address indexed tutor,
        string query,
        uint256 duration,
        uint256 amount,
        string fileURI
    );

    uint256 public sessionCounter;
    mapping(address => mapping(uint256 => Session)) public sessions;

    constructor() {
        sessionCounter = 0;
    }

    function makePayment(uint256 sessionId) public payable {
        Session storage session = sessions[msg.sender][sessionId];
        require(msg.sender == session.user, "Only the user can make the payment");
        require(msg.value >= session.amount, "Insufficient Ether sent");
        require(!session.paid, "Payment already made");

        session.tutor.transfer(session.amount);
        session.paid = true;
    }


    function createSession(
        address payable sessionTutor,
        string memory sessionQuery,
        uint256 sessionDuration,
        uint256 sessionAmount,
        string memory sessionFileURI
    ) public {
        sessionCounter++;
        Session memory newSession = Session(
            sessionCounter,
            msg.sender, 
            sessionTutor, 
            sessionQuery, 
            sessionDuration, 
            sessionAmount, 
            sessionFileURI,
            false
        );

        sessions[msg.sender][sessionCounter] = newSession;
        emit SessionEvent(
            sessionCounter,
            msg.sender, 
            sessionTutor, 
            sessionQuery, 
            sessionDuration, 
            sessionAmount, 
            sessionFileURI
        );
    }

    function returnSessions(address wallet) public returns (Session[] memory) {
        uint256 userSessionCounter = 0;
        for (uint256 i = 1; i <= sessionCounter; i++) {
            if (sessions[wallet][i].user == wallet) {
                userSessionCounter++;
            }
        }

        Session[] memory userSessions = new Session[](userSessionCounter);
        userSessionCounter = 0;

        for (uint256 i = 1; i <= sessionCounter; i++) {
            Session storage session = sessions[wallet][i];
            if (session.user == wallet) {
                userSessions[userSessionCounter] = session;
                userSessionCounter++;
                emit SessionRetrieved(
                    session.id,
                    session.user,
                    session.tutor,
                    session.query,
                    session.duration,
                    session.amount,
                    session.fileURI
                );
            }
        }

        return userSessions;
    }
}
