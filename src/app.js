let web3;
let accounts = [];
let identityContract;
let authContract;

// Contract ABIs and addresses (will be populated automatically)
let identityContractAddress;
let identityContractABI;
let authContractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_t",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "clientUpdateEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "newClientRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_pname",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_cid",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_cscrt",
                "type": "string"
            }
        ],
        "name": "addClientApp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "client",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "client_id",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "client_secret",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "project_name",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "clientIds",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getClientProfile",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getClientById",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "registerClient",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalClients",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Tab functionality
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Initialize the application
window.addEventListener('load', async () => {
    // Check if Web3 is injected
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            setupApp();
        } catch (error) {
            console.error("User denied account access");
        }
    } else if (window.web3) {
        // Legacy dapp browsers
        web3 = new Web3(window.web3.currentProvider);
        setupApp();
    } else {
        // Non-dapp browsers
        console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
        document.getElementById('connectButton').textContent = 'Install MetaMask';
        document.getElementById('connectButton').onclick = () => {
            window.open('https://metamask.io/', '_blank');
        };
    }
});

async function setupApp() {
    // Get accounts
    accounts = await web3.eth.getAccounts();
    document.getElementById('accountInfo').innerHTML = `Connected account: ${accounts[0]}`;
    document.getElementById('connectButton').textContent = 'Connected';
    document.getElementById('connectButton').disabled = true;

    // Get network ID to determine contract addresses
    const networkId = await web3.eth.net.getId();
    
    // Load Identity contract
    try {
        // In a real deployment, you would fetch these from your build files
        // For this example, we'll use a placeholder and assume you'll replace it
        identityContractAddress = 'YOUR_IDENTITY_CONTRACT_ADDRESS'; // Replace with actual address
        identityContractABI = [/* Your Identity contract ABI */];
        
        // For development, you can use the truffle artifact
        // This assumes you have access to the build files
        try {
            const identityArtifact = await fetch('/build/contracts/Identity.json').then(res => res.json());
            identityContractAddress = identityArtifact.networks[networkId].address;
            identityContractABI = identityArtifact.abi;
        } catch (e) {
            console.log("Couldn't load Identity artifact, using default ABI");
            // Fallback ABI if couldn't load from file
            identityContractABI = [
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "clientUpdateEvent",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "newClientRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "newUserRegistered",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "userUpdateEvent",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_clientid",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_token",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_scope",
                            "type": "string"
                        }
                    ],
                    "name": "addToken",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_pname",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_cid",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_cscrt",
                            "type": "string"
                        }
                    ],
                    "name": "addClientApp",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_clientid",
                            "type": "string"
                        }
                    ],
                    "name": "fetchToken",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_id",
                            "type": "uint256"
                        }
                    ],
                    "name": "getClientById",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getClientProfile",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getOwnProfile",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_id",
                            "type": "uint256"
                        }
                    ],
                    "name": "getUserById",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "isRegistered",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_name",
                            "type": "string"
                        }
                    ],
                    "name": "registerClient",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_dob",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_idhash",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_password",
                            "type": "string"
                        }
                    ],
                    "name": "registerUser",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalClients",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "totalUsers",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "_idhash",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "_password",
                            "type": "string"
                        }
                    ],
                    "name": "updateUser",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];
        }

        identityContract = new web3.eth.Contract(identityContractABI, identityContractAddress);
        
        // Setup event listeners
        setupEventListeners();
    } catch (error) {
        console.error("Error loading contract:", error);
    }
}

function setupEventListeners() {
    // Connect button
    document.getElementById('connectButton').addEventListener('click', async () => {
        if (window.ethereum) {
            try {
                accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                document.getElementById('accountInfo').innerHTML = `Connected account: ${accounts[0]}`;
                document.getElementById('connectButton').textContent = 'Connected';
                document.getElementById('connectButton').disabled = true;
                setupApp();
            } catch (error) {
                console.error("User denied account access");
            }
        }
    });

    // Identity Tab
    document.getElementById('registerUser').addEventListener('click', async () => {
        const name = document.getElementById('userName').value;
        const dob = document.getElementById('userDob').value;
        const idhash = document.getElementById('userIdHash').value;
        const password = document.getElementById('userPassword').value;
        
        try {
            const result = await identityContract.methods.registerUser(name, dob, idhash, password)
                .send({ from: accounts[0] });
            document.getElementById('userRegistrationResult').innerHTML = 
                `User registered successfully! Transaction hash: ${result.transactionHash}`;
        } catch (error) {
            document.getElementById('userRegistrationResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('getUserProfile').addEventListener('click', async () => {
        try {
            const result = await identityContract.methods.getOwnProfile().call({ from: accounts[0] });
            document.getElementById('userProfileResult').innerHTML = 
                `User Profile:<br>
                ID: ${result[0]}<br>
                Name: ${result[1]}<br>
                Date of Birth: ${result[2]}<br>
                Wallet Address: ${result[3]}<br>
                ID Hash: ${result[4]}<br>
                Password: ${result[5]}`;
        } catch (error) {
            document.getElementById('userProfileResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('updateUser').addEventListener('click', async () => {
        const idhash = document.getElementById('updateIdHash').value;
        const password = document.getElementById('updatePassword').value;
        
        try {
            const result = await identityContract.methods.updateUser(idhash, password)
                .send({ from: accounts[0] });
            document.getElementById('updateUserResult').innerHTML = 
                `User updated successfully! Transaction hash: ${result.transactionHash}`;
        } catch (error) {
            document.getElementById('updateUserResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    // Client Tab
    document.getElementById('registerClient').addEventListener('click', async () => {
        const name = document.getElementById('clientName').value;
        
        try {
            const result = await identityContract.methods.registerClient(name)
                .send({ from: accounts[0] });
            document.getElementById('clientRegistrationResult').innerHTML = 
                `Client registered successfully! Transaction hash: ${result.transactionHash}`;
        } catch (error) {
            document.getElementById('clientRegistrationResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('addClientApp').addEventListener('click', async () => {
        const pname = document.getElementById('projectName').value;
        const cid = document.getElementById('clientId').value;
        const cscrt = document.getElementById('clientSecret').value;
        
        try {
            const result = await identityContract.methods.addClientApp(pname, cid, cscrt)
                .send({ from: accounts[0] });
            document.getElementById('clientAppResult').innerHTML = 
                `Client app added successfully! Transaction hash: ${result.transactionHash}`;
        } catch (error) {
            document.getElementById('clientAppResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('getClientProfile').addEventListener('click', async () => {
        try {
            const result = await identityContract.methods.getClientProfile().call({ from: accounts[0] });
            document.getElementById('clientProfileResult').innerHTML = 
                `Client Profile:<br>
                Name: ${result[0]}<br>
                Client ID: ${result[1]}<br>
                Client Secret: ${result[2]}<br>
                Project Name: ${result[3]}`;
        } catch (error) {
            document.getElementById('clientProfileResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('addToken').addEventListener('click', async () => {
        const clientid = document.getElementById('clientIdForToken').value;
        const token = document.getElementById('accessToken').value;
        const scope = document.getElementById('scope').value;
        
        try {
            const result = await identityContract.methods.addToken(clientid, token, scope)
                .send({ from: accounts[0] });
            document.getElementById('tokenResult').innerHTML = 
                `Token added successfully! Transaction hash: ${result.transactionHash}`;
        } catch (error) {
            document.getElementById('tokenResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('fetchToken').addEventListener('click', async () => {
        const clientid = document.getElementById('clientIdForToken').value;
        
        try {
            const result = await identityContract.methods.fetchToken(clientid).call({ from: accounts[0] });
            document.getElementById('tokenResult').innerHTML = 
                `Access Token: ${result}`;
        } catch (error) {
            document.getElementById('tokenResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    // Auth Tab
    document.getElementById('initAuth').addEventListener('click', async () => {
        const authAddress = document.getElementById('authContractAddress').value;
        
        try {
            authContract = new web3.eth.Contract(authContractABI, authAddress);
            document.getElementById('authInitResult').innerHTML = 
                `Auth contract initialized successfully!`;
        } catch (error) {
            document.getElementById('authInitResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('authRegisterClient').addEventListener('click', async () => {
        const name = document.getElementById('authClientName').value;
        
        try {
            const result = await authContract.methods.registerClient(name)
                .send({ from: accounts[0] });
            document.getElementById('authClientRegistrationResult').innerHTML = 
                `Client registered successfully in Auth contract! Transaction hash: ${result.transactionHash}`;
        } catch (error) {
            document.getElementById('authClientRegistrationResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('authAddClientApp').addEventListener('click', async () => {
        const pname = document.getElementById('authProjectName').value;
        const cid = document.getElementById('authClientId').value;
        const cscrt = document.getElementById('authClientSecret').value;
        
        try {
            const result = await authContract.methods.addClientApp(pname, cid, cscrt)
                .send({ from: accounts[0] });
            document.getElementById('authClientAppResult').innerHTML = 
                `Client app added successfully in Auth contract! Transaction hash: ${result.transactionHash}`;
        } catch (error) {
            document.getElementById('authClientAppResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });

    document.getElementById('authGetClientProfile').addEventListener('click', async () => {
        try {
            const result = await authContract.methods.getClientProfile().call({ from: accounts[0] });
            document.getElementById('authClientProfileResult').innerHTML = 
                `Client Profile (Auth):<br>
                Name: ${result[0]}<br>
                Client ID: ${result[1]}<br>
                Client Secret: ${result[2]}<br>
                Project Name: ${result[3]}`;
        } catch (error) {
            document.getElementById('authClientProfileResult').innerHTML = 
                `Error: ${error.message}`;
        }
    });
}