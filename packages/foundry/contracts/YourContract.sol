// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
    // Constants
    uint256 public constant MAX_HEALTH = 10;
    uint256 public constant MIN_HEALTH = 0;
    uint256 public constant TEAMS_COUNT = 6;

    struct Team {
        string name; // Nome da equipe
        uint256 health;
        uint256 playerCount;
    }

    struct Player {
        string username;
        uint256 teamId;
        bool exists;
        uint256 damageDealt; // Total damage dealt by player
        uint256 healingDone; // Total healing done by player
    }

    // Mappings
    mapping(uint256 => Team) public teams; // teamId => Team
    mapping(address => Player) public players; // player address => Player
    mapping(string => bool) public usernameExists; // username => exists

    // Events
    event PlayerRegistered(address player, string username, uint256 teamId);
    event TeamAttacked(
        uint256 fromTeamId,
        uint256 targetTeamId,
        uint256 newHealth,
        address attacker
    );
    event TeamHealed(uint256 teamId, uint256 newHealth, address healer);

    // Adicionar endereço da carteira autorizada
    address public gameOperator;
    
    // Modificador para funções que só a carteira backend pode chamar
    modifier onlyOperator() {
        require(msg.sender == gameOperator, "Only game operator can execute");
        _;
    }

    constructor() {
        gameOperator = msg.sender; // Quem faz deploy será o operador inicial
        
        // Initialize all teams with max health and names
        string[TEAMS_COUNT] memory teamNames = [
            "Dragons",
            "Phoenix",
            "Unicorns",
            "Griffins",
            "Krakens",
            "Chimeras"
        ];
        
        for(uint256 i = 0; i < TEAMS_COUNT; i++) {
            teams[i] = Team({
                name: teamNames[i],
                health: MAX_HEALTH,
                playerCount: 0
            });
        }
    }

    // Função para mudar o operador se necessário
    function setGameOperator(address newOperator) public {
        require(msg.sender == gameOperator, "Only current operator can change");
        gameOperator = newOperator;
    }

    // Modificar funções de ação para serem chamadas pelo operador
    function registerPlayer(address player, string memory username) public onlyOperator {
        require(!players[player].exists, "Player already registered");
        require(!usernameExists[username], "Username already taken");
        require(bytes(username).length > 0, "Username cannot be empty");
        
        uint256 selectedTeam = getTeamWithLeastPlayers();
        
        players[player] = Player({
            username: username,
            teamId: selectedTeam,
            exists: true,
            damageDealt: 0,
            healingDone: 0
        });
        
        teams[selectedTeam].playerCount++;
        usernameExists[username] = true;
        
        emit PlayerRegistered(player, username, selectedTeam);
    }

    function attackTeam(address player, uint256 targetTeamId) public onlyOperator {
        require(players[player].exists, "Player not registered");
        require(targetTeamId < TEAMS_COUNT, "Invalid team ID");
        require(targetTeamId != players[player].teamId, "Cannot attack own team");
        require(teams[targetTeamId].health > MIN_HEALTH, "Team already defeated");
        
        uint256 newHealth = teams[targetTeamId].health - 1;
        teams[targetTeamId].health = newHealth;
        
        players[player].damageDealt += 1;
        
        emit TeamAttacked(players[player].teamId, targetTeamId, newHealth, player);
    }

    function healTeam(address player) public onlyOperator {
        require(players[player].exists, "Player not registered");
        uint256 teamId = players[player].teamId;
        require(teams[teamId].health < MAX_HEALTH, "Team already at max health");
        
        uint256 newHealth = teams[teamId].health + 1;
        teams[teamId].health = newHealth;
        
        players[player].healingDone += 1;
        
        emit TeamHealed(teamId, newHealth, player);
    }

    // Helper function to get team with least players
    function getTeamWithLeastPlayers() internal view returns (uint256) {
        uint256 minPlayers = type(uint256).max;
        uint256 selectedTeam = 0;

        for (uint256 i = 0; i < TEAMS_COUNT; i++) {
            if (teams[i].playerCount < minPlayers) {
                minPlayers = teams[i].playerCount;
                selectedTeam = i;
            }
        }

        return selectedTeam;
    }

    // View functions
    function getTeamHealth(uint256 teamId) public view returns (uint256) {
        require(teamId < TEAMS_COUNT, "Invalid team ID");
        return teams[teamId].health;
    }

    function getPlayerTeam(address player) public view returns (uint256) {
        require(players[player].exists, "Player not registered");
        return players[player].teamId;
    }

    function getPlayerStats(
        address player
    ) public view returns (uint256 damage, uint256 healing) {
        require(players[player].exists, "Player not registered");
        return (players[player].damageDealt, players[player].healingDone);
    }

    function canAttack(uint256 targetTeamId) public view returns (bool) {
        if (!players[msg.sender].exists) return false;
        if (targetTeamId >= TEAMS_COUNT) return false;
        if (targetTeamId == players[msg.sender].teamId) return false;
        if (teams[targetTeamId].health <= MIN_HEALTH) return false;
        return true;
    }

    function canHeal() public view returns (bool) {
        if (!players[msg.sender].exists) return false;
        uint256 teamId = players[msg.sender].teamId;
        if (teams[teamId].health >= MAX_HEALTH) return false;
        return true;
    }

    // Struct para retornar informações da equipe
    struct TeamInfo {
        uint256 teamId;
        string name;
        uint256 health;
        uint256 playerCount;
    }

    // Nova função para obter informações de uma equipe específica
    function getTeamInfo(uint256 teamId) public view returns (TeamInfo memory) {
        require(teamId < TEAMS_COUNT, "Invalid team ID");
        return
            TeamInfo({
                teamId: teamId,
                name: teams[teamId].name,
                health: teams[teamId].health,
                playerCount: teams[teamId].playerCount
            });
    }

    // Nova função para obter informações de todas as equipes
    function getAllTeams() public view returns (TeamInfo[] memory) {
        TeamInfo[] memory allTeams = new TeamInfo[](TEAMS_COUNT);

        for (uint256 i = 0; i < TEAMS_COUNT; i++) {
            allTeams[i] = TeamInfo({
                teamId: i,
                name: teams[i].name,
                health: teams[i].health,
                playerCount: teams[i].playerCount
            });
        }

        return allTeams;
    }

    // Nova função para obter o nome da equipe
    function getTeamName(uint256 teamId) public view returns (string memory) {
        require(teamId < TEAMS_COUNT, "Invalid team ID");
        return teams[teamId].name;
    }
}
