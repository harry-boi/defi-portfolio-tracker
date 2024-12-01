import React, { useState } from "react";
import { useEffect } from "react";
import MetricCard from "./MetricCard.jsx";
import AssetCard from "./AssetCard.jsx";
import {
  fetchBalance,
  fetchTokenBalances,
  calculateProfitLoss,
} from "../utils/main.js";

const DashboardMetrics = () => {
  const [walletBalanceInEther, setWalletBalanceInEther] = useState(0.0);
  const [walletBalanceInUsd, setWalletBalanceInUsd] = useState(0.0);
  const [account, setAccount] = useState("");
  const [profitLoss, setProfitLoss] = useState(0);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [numberOfAssets, setNumberOfAssets] = useState(0);

  const getBalance = async (account) => {
    if (!account.startsWith("0x") || account.length !== 42) {
      alert("Enter a valid ethereum wallet address");
      return;
    }

    const balanceInEther = await fetchBalance(account);
    setWalletBalanceInEther(balanceInEther.toFixed(4));

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const data = await response.json();
    const etherPriceToday = data.ethereum.usd;
    const balanceInUsd = (balanceInEther * etherPriceToday).toFixed(4);
    console.log(balanceInUsd);
    setWalletBalanceInUsd(balanceInUsd);
    const result = await calculateProfitLoss(account, etherPriceToday);
    const profitLoss = result ? result : 0;
    if (result == 0 || result == null) {
      setError("No data to show for this Wallet");
      return;
    }

    setProfitLoss(profitLoss);
    console.log("Profit/Loss in USD for last 30 days:", profitLoss);
    const tokens = await fetchTokenBalances(account);
    setNumberOfAssets(tokens.length);
    setTokens(tokens);
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-4 pt-6">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Enter an ethereum wallet address"
            className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {account && (
            <button
              onClick={() => setAccount("")} // Clears the input when clicked
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={() => getBalance(account)}
          className="rounded-md p-2 ms-2 bg-gray-950 text-white"
        >
          Track wallet
        </button>
      </div>

      {error && (
        <div className="text-red-500 font-semibold text-sm bg-red-200 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 my-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          label="Ether Balance"
          value={walletBalanceInEther}
          change=""
          color="bg-green-100"
        />
        <MetricCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          label="Balance in USD"
          value={`$${walletBalanceInUsd}`}
          change=""
          color="bg-blue-100"
        />
        <MetricCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                profitLoss < 0 ? "text-red-600" : "text-green-600"
              } `}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          }
          label="30-day P/L (USD)"
          value={`$${profitLoss}`}
          change={profitLoss < 0 ? `-${profitLoss}` : `+${profitLoss}`}
          color={
            profitLoss > 0
              ? "bg-green-100"
              : profitLoss < 0
              ? "bg-red-100"
              : "bg-gray-100"
          }
          comment={profitLoss < 0 ? "Loss" : "Profit"}
        />
        <MetricCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          }
          label="Assets"
          value={numberOfAssets}
          change=""
          color="bg-purple-100"
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Assets</h2>
          <div className="text-sm text-gray-500">Balance</div>
        </div>
      </div>

      <div className="space-y-4">
        {tokens.length > 0 ? (
          tokens.map((token, index) => (
            <AssetCard
              key={index}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
              label={token.symbol}
              value={`${token.balance.toFixed(4)}`}
              change=""
              color="bg-indigo-100"
            />
          ))
        ) : (
          <div>No tokens found.</div>
        )}
      </div>
    </div>
  );
};

export default DashboardMetrics;
