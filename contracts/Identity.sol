pragma solidity ^0.5.16;

contract Identity {
    struct Person {
        string name;
        string date_of_birth;
        address walletAddress;
        string idhash;
        string password;
    }
    
    struct Client {
        string name;
        string client_id;
        string client_secret;
        string project_name;
    }
    
    struct Access {
        string access_token;
        string scope;
    }
    
    mapping (address => uint) public personIds;
    mapping (address => uint) public clientIds;
    mapping (string => mapping(address => Access)) accesstoken;
    
    Person[] public persons;
    Client[] public client;

    event newUserRegistered(uint id);
    event userUpdateEvent(uint id);
    event newClientRegistered(uint id);
    event clientUpdateEvent(uint id);
    
    modifier checkSenderIsRegistered {
        require(isRegistered(), "User not registered");
        _;
    }

    constructor() public {
        addUser(address(0), "", "", "", "");
        addClient(address(0), "");
    }

    function addToken(string memory _clientid, string memory _token, string memory _scope) public returns(string memory) {
        Access storage a = accesstoken[_clientid][msg.sender];
        a.access_token = _token;
        a.scope = _scope;
        return _token;
    }

    function fetchToken(string memory _clientid) public view returns(string memory) {
        Access memory a = accesstoken[_clientid][msg.sender];
        return a.access_token;
    }
   
    function registerClient(string memory _name) public returns(uint) {
        return addClient(msg.sender, _name);
    }

    function addClient(address _wAddr, string memory _name) private returns(uint) {
        require(clientIds[_wAddr] == 0, "Client already exists");
        
        uint newClientId = client.length;
        clientIds[_wAddr] = newClientId;
        client.push(Client({
            name: _name,
            client_id: "",
            client_secret: "",
            project_name: ""
        }));
        
        emit newClientRegistered(newClientId);
        return newClientId;
    }

    function addClientApp(string memory _pname, string memory _cid, string memory _cscrt) public returns(uint) {
        uint clientId = clientIds[msg.sender];
        Client storage c = client[clientId];
        c.project_name = _pname;
        c.client_id = _cid;
        c.client_secret = _cscrt;

        emit clientUpdateEvent(clientId);
        return clientId;
    }

    function getClientById(uint _id) public view returns(
        string memory,
        string memory,
        string memory,
        string memory
    ) {
        require(_id < client.length, "Invalid client ID");
        Client memory i = client[_id];
        return (i.name, i.client_id, i.client_secret, i.project_name);
    }
    
    function getClientProfile() checkSenderIsRegistered public view returns(
        string memory,
        string memory,
        string memory,
        string memory
    ) {
        uint ids = clientIds[msg.sender];
        return getClientById(ids);
    }

    function registerUser(string memory _name, string memory _dob, string memory _idhash, string memory _password) public returns(uint) {
        return addUser(msg.sender, _name, _dob, _idhash, _password);
    }

    function addUser(address _wAddr, string memory _name, string memory _dob, string memory _idhash, string memory _password) private returns(uint) {
        require(personIds[_wAddr] == 0, "User already exists");
        
        uint newUserId = persons.length;
        personIds[_wAddr] = newUserId;
        persons.push(Person({
            name: _name,
            date_of_birth: _dob,
            walletAddress: _wAddr,
            idhash: _idhash,
            password: _password
        }));
        
        emit newUserRegistered(newUserId);
        return newUserId;
    }

    function updateUser(string memory _idhash, string memory _password) checkSenderIsRegistered public returns(uint) {
        uint userId = personIds[msg.sender];
        Person storage person = persons[userId];
        person.idhash = _idhash;
        person.password = _password;

        emit userUpdateEvent(userId);
        return userId;
    }

    function getUserById(uint _id) public view returns(
        uint,
        string memory,
        string memory,
        address,
        string memory,
        string memory
    ) {
        require(_id < persons.length, "Invalid user ID");
        Person memory i = persons[_id];
        return (_id, i.name, i.date_of_birth, i.walletAddress, i.idhash, i.password);
    }

    function getOwnProfile() checkSenderIsRegistered public view returns(
        uint,
        string memory,
        string memory,
        address,
        string memory,
        string memory
    ) {
        uint id = personIds[msg.sender];
        return getUserById(id);
    }

    function isRegistered() public view returns (bool) {
        return (personIds[msg.sender] > 0);
    }

    function totalUsers() public view returns (uint) {
        return persons.length;
    }

    function totalClients() public view returns (uint) {
        return client.length;
    }
}