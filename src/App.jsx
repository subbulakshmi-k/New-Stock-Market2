import React, { useState, useEffect } from "react";
import "./App.css";

// Simulate live stock data (expandable to real APIs)
const INITIAL_STOCKS = [
  { symbol: "TSLA", price: 843.5, change: 4.3 },
  { symbol: "INFY", price: 1844.1, change: -1.6 },
  { symbol: "TATASTEEL", price: 715.1, change: 0.7 },
  { symbol: "RELIANCE", price: 3021.9, change: -2.1 },
  { symbol: "GOOGL", price: 3281.9, change: 6.0 },
  { symbol: "SBI", price: 677.4, change: -0.5 },
];
const MOODS = ["😃", "😐", "😔", "😱", "🚀", "🤑"];

function randomizeStocks(stocks) {
  return stocks.map((s) => {
    let delta = (Math.random() - 0.5) * 6;
    let next = Math.round((s.price + delta) * 100) / 100;
    let nextChange = Math.round((next - s.price) * 10) / 10;
    return { ...s, price: next, change: nextChange };
  });
}

// --- Currency Converter --- //
function CurrencyConverter() {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [output, setOutput] = useState("");
  // Fake live rates; replace with API call as needed
  const RATES = { USD: 1, INR: 83.2, EUR: 0.92, BTC: 0.000017 };

  useEffect(() => {
    const val = parseFloat(input);
    if (!isNaN(val) && from && to) {
      // Convert to USD as base, then to target currency
      const usdValue = val / RATES[from];
      const result = usdValue * RATES[to];
      setOutput(result.toFixed(to === "BTC" ? 6 : 2));
    } else {
      setOutput("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, from, to]);

  return (
    <div className="currency-converter glass-tile">
      <h2>Currency Converter</h2>
      <div className="cur-row">
        <input
          type="number"
          value={input}
          min="0"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Amount"
        />
        <select value={from} onChange={e => setFrom(e.target.value)}>
          <option>USD</option>
          <option>INR</option>
          <option>EUR</option>
          <option>BTC</option>
        </select>
        <span className="cur-swap">→</span>
        <select value={to} onChange={e => setTo(e.target.value)}>
          <option>USD</option>
          <option>INR</option>
          <option>EUR</option>
          <option>BTC</option>
        </select>
      </div>
      <button className="conv-3d-btn">Convert</button>
      <div className="cur-result">
        {output && `= ${output} ${to}`}
      </div>
      <div className="cur-hint">(Rates change live – for demo only)</div>
    </div>
  );
}

// --- Investment Calculator w/Profit ("Inma") --- //
function InvestmentCalculator() {
  const [stockName, setStockName] = useState("");
  const [amount, setAmount] = useState("");
  const [growth, setGrowth] = useState("");
  const [total, setTotal] = useState("");
  const [profit, setProfit] = useState("");
  useEffect(() => {
    const amt = parseFloat(amount);
    const grw = parseFloat(growth);
    if (!isNaN(amt) && !isNaN(grw)) {
      const result = amt * (1 + grw / 100);
      setTotal(result.toFixed(2));
      setProfit((result - amt).toFixed(2));
    } else {
      setTotal("");
      setProfit("");
    }
  }, [amount, growth]);
  return (
    <div className="investment-calculator pro-glass-card">
      <h2>Investment Calculator</h2>
      <input
        type="text"
        placeholder="Stock Name"
        value={stockName}
        onChange={e => setStockName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount Invested"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Expected Growth (%)"
        value={growth}
        onChange={e => setGrowth(e.target.value)}
      />
      <button className="calc-3d-btn" tabIndex={-1}>Calculate</button>
      {total && (
        <div className="total-output">
          Total after growth: <span>₹{total}</span>
        </div>
      )}
      {profit && (
        <div className="profit-output">
          Profit (இன்மா): <span>₹{profit}</span>
        </div>
      )}
      {stockName && (
        <div className="stock-display">
          Stock: <b>{stockName}</b>
        </div>
      )}
    </div>
  );
}

// --- Main App (Dashboard) --- //
export default function App() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [moodIdx, setMoodIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStocks(prev => randomizeStocks(prev)), 2200);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const moodInt = setInterval(() => setMoodIdx(i => (i + 1) % MOODS.length), 3500);
    return () => clearInterval(moodInt);
  }, []);

  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <div className="stock-ticker">
          <div className="ticker-content">
            {stocks.map((s) => (
              <span key={s.symbol}>
                {s.symbol}{" "}
                <span className={s.change >= 0 ? "ticker-up" : "ticker-down"}>
                  {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change).toFixed(1)}%
                </span>
                &nbsp;&nbsp;
              </span>
            ))}
          </div>
          <div className="ticker-wave">
            <svg width="100%" height="20px" viewBox="0 0 120 20" preserveAspectRatio="none">
              <path
                d="M0 10 Q 20 20, 40 10 T 80 10 T 120 10 V20 H0 Z"
                fill="#00e6e699"
                className="wave-path"
              />
            </svg>
          </div>
        </div>

        <div className="market-mood">
          <span className="mood-label">Market Mood:</span>
          <span className="mood-bar">
            <span className="mood-emoji">{MOODS[moodIdx]}</span>
            <span className="mood-gradient"></span>
          </span>
        </div>

        <div className="card-3d glass">
          <h1>My Stock Portfolio</h1>
          <div className="ticker-badges">
            <span className="ticker-badge trending">TSLA 🔥</span>
            <span className="ticker-badge down">RELIANCE</span>
            <span className="ticker-badge">ITC 🚀</span>
            <span className="ticker-badge down">SBI</span>
          </div>
          <div className="market-heatmap">
            {stocks.map((s) => (
              <div key={s.symbol} className={"market-heatmap-cell " + (s.change >= 0 ? "up" : "down")}>
                {s.symbol}
              </div>
            ))}
          </div>
          <div className="performance-rings">
            <div className="performance-ring ring-up">
              <span>
                +
                {Math.max(
                  stocks.reduce((a, s) => (s.change > a ? s.change : a), 0),
                  0
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="performance-ring ring-down">
              <span>
                {Math.min(
                  stocks.reduce((a, s) => (s.change < a ? s.change : a), 0),
                  0
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h2>{stocks[2].symbol}</h2>
                <p>₹{stocks[2].price.toLocaleString()}</p>
                <span className={stocks[2].change >= 0 ? "ticker-up" : "ticker-down"}>
                  {stocks[2].change >= 0 ? "▲" : "▼"} {Math.abs(stocks[2].change).toFixed(1)}%
                </span>
              </div>
              <div className="flip-card-back">
                <h3>Analytics</h3>
                <p>52W H: ₹810</p>
                <p>52W L: ₹680</p>
                <p>Volume: 1.1M</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAJOR ADDITIONS */}
        <div className="addon-modules">
          <CurrencyConverter />
          <InvestmentCalculator />
        </div>
      </div>
    </div>
  );
}
