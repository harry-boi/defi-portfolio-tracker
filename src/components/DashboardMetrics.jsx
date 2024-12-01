import React, { useState } from "react";
import { useEffect } from "react";
import MetricCard from "./MetricCard.jsx";
import { fetchBalance, calculateProfitLoss } from "../utils/main.js";

const DashboardMetrics = () => {
  const [walletBalanceInEther, setWalletBalanceInEther] = useState(0.0);
  const [walletBalanceInUsd, setWalletBalanceInUsd] = useState(0.0);
  const [account, setAccount] = useState("");
  const [profitLoss, setProfitLoss] = useState(0);
  const [error, setError] = useState(null);

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
    setWalletBalanceInUsd(etherPriceToday * walletBalanceInEther);
    const result = await calculateProfitLoss(account, etherPriceToday);
    const profitLoss = result ? result : 0;
    if (result == 0 || result == null) {
      setError("No data to show for this Wallet");
      return;
    }

    setProfitLoss(profitLoss);
    console.log("Profit/Loss in USD for last 30 days:", profitLoss);
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
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={account}
          onChange={(e) => {
            setAccount(e.target.value);
          }}
          placeholder="Enter an ethereum wallet address"
          className="flex-1 max-w-xl p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          change="+72.80%"
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
          value={walletBalanceInUsd}
          change="+28.42%"
          color="bg-blue-100"
        />
        <MetricCard
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
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
          change={profitLoss < 0 ? "Loss" : "profit"}
          color={profitLoss === 0 ? "bg-green-100" : "bg-red-100"}
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
          label="Transactions"
          value="$14,857"
          change="+28.14%"
          color="bg-purple-100"
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Profile Report</h2>
          <div className="text-sm text-gray-500">YEAR 2022</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
