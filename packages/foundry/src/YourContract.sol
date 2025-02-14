// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract YourContract {
    struct Player {
        string userId;
        uint256 score;
        bool exists;
        address walletAddress;
        string email;
    }
    
    mapping(string => Player) public players;              // userId => Player
    mapping(string => string) public recoveryToUserId;     // recoveryCode => userId
    mapping(address => string) public walletToUserId;      // wallet => userId
    mapping(string => string) public emailToUserId;        // hashed email => userId
    
    event PlayerRegistered(string userId);
    event MoveCompleted(string userId, uint256 points);
    
    function registerUser(
        string memory userId, 
        string memory recoveryCode,
        address wallet,
        string memory email
    ) public {
        require(!players[userId].exists, "User already exists");
        
        players[userId] = Player({
            userId: userId,
            score: 0,
            exists: true,
            walletAddress: wallet,
            email: email
        });
        
        recoveryToUserId[recoveryCode] = userId;
        
        if (wallet != address(0)) {
            walletToUserId[wallet] = userId;
        }
        
        if (bytes(email).length > 0) {
            emailToUserId[keccak256(abi.encodePacked(email))] = userId;
        }
        
        emit PlayerRegistered(userId);
    }
    
    function getUserIdByRecoveryCode(string memory recoveryCode) public view returns (string memory) {
        string memory userId = recoveryToUserId[recoveryCode];
        require(bytes(userId).length > 0, "Invalid recovery code");
        return userId;
    }
    
    function playMove(string memory userId, /* other params */) public {
        require(players[userId].exists, "Player not registered");
        // Game logic here
        players[userId].score += points;
        emit MoveCompleted(userId, points);
    }
    
    function getPlayerScore(string memory userId) public view returns (uint256) {
        require(players[userId].exists, "Player not found");
        return players[userId].score;
    }
} 