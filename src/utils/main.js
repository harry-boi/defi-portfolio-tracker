import { ETHERSCAN_API_KEY, ETHERSCAN_URL } from "./credentials.js";

export const fetchBalance = async (address) => {
  try {
    // Build the API URL with query parameters
    const url = `${ETHERSCAN_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;

    const response = await fetch(url);

    // Parse the response as JSON
    const data = await response.json();
    if (data.status === "1" && data.result) {
      const balanceInWei = data.result;
      //   console.log(`Balance in Wei: ${balanceInWei}`);
      // Convert balance to Ether (1 Ether = 10^18 Wei)
      const balanceInEther = balanceInWei / 1e18;
      //   console.log(`Balance in Ether: ${balanceInEther}`);
      return balanceInEther;
    } else {
      console.error("Error fetching balance:", data.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export const fetchTransactionHistory = async (address) => {
  try {
    const url = `${ETHERSCAN_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.status === "1") {
      return data.result; // Array of transactions
    } else {
      //   console.error("Error fetching transaction history:", data.message);
      return [];
    }
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
};

export const calculateProfitLoss = async (address, etherPriceToday) => {
  try {
    const transactions = await fetchTransactionHistory(address);
    if (!transactions.length) {
      //   console.log("transaction is empty");
      return null;
    }
    // Continue with the logic if transactions exist
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;
    const recentTxs = transactions.filter(
      (tx) => tx.timeStamp >= thirtyDaysAgo
    );

    let totalReceived = 0;
    let totalSent = 0;
    let gasFees = 0;

    for (const tx of recentTxs) {
      const valueInEther = parseFloat(tx.value) / 1e18;
      if (tx.to.toLowerCase() === address.toLowerCase()) {
        totalReceived += valueInEther;
      } else if (tx.from.toLowerCase() === address.toLowerCase()) {
        totalSent += valueInEther;
        gasFees += (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18;
      }
    }

    const netTransfers = totalReceived - (totalSent + gasFees);
    const etherPrice30DaysAgo = etherPriceToday * 0.9;
    const profitLoss =
      netTransfers * etherPriceToday - netTransfers * etherPrice30DaysAgo;

    return profitLoss.toFixed(2);
  } catch (error) {
    return { error: error.message };
  }
};
