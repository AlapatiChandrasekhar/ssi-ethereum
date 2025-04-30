module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545, // or 8545 depending on your Ganache
            network_id: "*"
        },
        ganache: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        privatebc: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "4224"
        },
    }
};
