# Self-Sovereign Identity (SSI) on Ethereum

This project demonstrates the implementation of a **Self-Sovereign Identity (SSI)** system on the Ethereum blockchain. It allows users to create, manage, and securely share digital identities using smart contracts.

---

## 🌐 Project Overview

**Self-Sovereign Identity (SSI)** represents a new model for digital identity where users have full control over their personal data. This system leverages Ethereum smart contracts to manage identities in a decentralized, privacy-preserving, and verifiable manner.

### ✅ Features

- Decentralized identity creation and management
- User-controlled data access
- Secure sharing of verified credentials
- OAuth-style token-based authentication
- Selective disclosure of personal information

---

## 🛠️ Technical Stack

| Layer           | Technologies                 |
|----------------|------------------------------|
| Smart Contracts | Solidity, Truffle, Ganache   |
| Blockchain      | Ethereum (local testnet)     |
| Frontend        | HTML, CSS, JavaScript        |
| Web3 Integration| Web3.js, MetaMask            |
| Development     | Truffle, http-server         |

---

## ⚙️ Smart Contracts Overview

### 1. **Identity Contract**
- Manages user identity creation and profile updates
- Implements access control
- Stores user identity metadata
- Verifies identity ownership

### 2. **Auth Contract**
- Manages third-party client applications
- Implements OAuth-like authentication flows
- Issues and validates access tokens

### 3. **Migrations Contract**
- Handles contract deployment and versioning
- Manages contract updates across the network

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AlapatiChandrasekhar/ssi-ethereum.git
cd ssi-ethereum
