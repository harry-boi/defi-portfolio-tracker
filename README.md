# Ethereum Portfolio Tracker

## Overview

The Ethereum Portfolio Tracker is a Vite React application that allows users to track their Ethereum wallet balance, see profits and losses over the last 30 days, and view the ERC-20 tokens held in the wallet. The app fetches data from the [Etherscan API](https://etherscan.io/) and integrates it with real-time pricing data to calculate wallet values in USD.

---

## Features

- Displays wallet balance in **Ether (ETH)** and **USD**.
- Shows **30-day profit and loss (P/L)** based on transactions.
- Displays a list of **ERC-20 tokens** held in the wallet, including token names, balances, and values.

---

## Prerequisites

Before running the app, ensure you have the following:

- **Node.js** (v14 or later)
- **npm** (or **yarn**)

---

## Setup Instructions

### 1. Clone the repository

Clone this project to your local machine using Git:

```bash
git clone https://github.com/your-username/ethereum-portfolio-tracker.git
cd ethereum-portfolio-tracker


npm install

-To securely store your API keys and configuration, we use environment variables. Since this is a Vite application, environment variables need to be prefixed with VITE_.

-Create a .env file in the root of your project and add the following variables:

VITE_ETHERSCAN_API_KEY=your-etherscan-api-key
VITE_ETHERSCAN_URL=https://api.etherscan.io/api

npm run dev
```
