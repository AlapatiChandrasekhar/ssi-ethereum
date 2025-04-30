pragma solidity ^0.5.16;

contract IIdentity {
    function isRegistered() public view returns(bool);
}

contract Auth {
    IIdentity user;
    constructor(address _t) public {
        user = IIdentity(_t);
    }
    
    struct Client {
        string name;
        string client_id;
        string client_secret;
        string project_name;
    }
    
    mapping (address => uint) public clientIds;
    Client[] public client;

    event newClientRegistered(uint id);
    event clientUpdateEvent(uint id);

    modifier checkSenderIsRegistered {
        require(user.isRegistered(), "User is not registered.");
        _;
    }

    function registerClient(string memory _name) public returns(uint) {
        return addClient(msg.sender, _name);
    }

    function addClient(address _wAddr, string memory _name) private returns(uint) {
        uint clientId = clientIds[_wAddr];
        require(clientId == 0, "Client already registered");

        clientIds[_wAddr] = client.length;
        uint newClientId = client.length++;
        
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

    function totalClients() public view returns (uint) {
        return client.length;
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
}