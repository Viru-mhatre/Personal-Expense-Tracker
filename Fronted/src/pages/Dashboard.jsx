
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/API";
import "./Dashboard.css";

function Dashboard() {
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
    });

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [summaryResponse, transactionResponse] =
                    await Promise.all([
                        api.get("/transactions/summary"),
                        api.get("/transactions")
                    ]);

                setSummary(summaryResponse.data);
                setTransactions(transactionResponse.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatAmount = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    // Expense category totals
    const categoryTotals = transactions
        .filter((transaction) => transaction.type === "EXPENSE")
        .reduce((result, transaction) => {
            const category = transaction.category || "Other";

            result[category] =
                (result[category] || 0) + Number(transaction.amount || 0);

            return result;
        }, {});

    const categoryData = Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

    const maxCategoryAmount = Math.max(
        ...categoryData.map((item) => item.amount),
        1
    );

    // Income and expense comparison
    const maxAmount = Math.max(
        Number(summary.totalIncome || 0),
        Number(summary.totalExpense || 0),
        1
    );

    const incomeWidth =
        (Number(summary.totalIncome || 0) / maxAmount) * 100;

    const expenseWidth =
        (Number(summary.totalExpense || 0) / maxAmount) * 100;

    return (
        <div>
            <Navbar />

            <main className="dashboard-container">

                <div className="dashboard-heading">
                    <div>
                        <h1>Dashboard Overview</h1>
                        <p>Welcome back! Here's your financial summary.</p>
                    </div>

                    <Link to="/add-transaction">
                    </Link>
                </div>

                {error && <p className="error">{error}</p>}

                {/* SUMMARY CARDS */}

                <div className="dashboard-cards">

                    <div className="dashboard-card balance-card">
                        <div className="card-icon">💰</div>
                        <h3>Total Balance</h3>
                        <h2>{loading ? "Loading..." : formatAmount(summary.balance)}</h2>
                        <p>Your available balance</p>
                    </div>

                    <div className="dashboard-card income-card">
                        <div className="card-icon">📈</div>
                        <h3>Total Income</h3>
                        <h2>{loading ? "Loading..." : formatAmount(summary.totalIncome)}</h2>
                        <p>Money received</p>
                    </div>

                    <div className="dashboard-card expense-card">
                        <div className="card-icon">📉</div>
                        <h3>Total Expenses</h3>
                        <h2>{loading ? "Loading..." : formatAmount(summary.totalExpense)}</h2>
                        <p>Money spent</p>
                    </div>

                    <div className="dashboard-card count-card">
                        <div className="card-icon">🧾</div>
                        <h3>Total Transactions</h3>
                        <h2>{loading ? "Loading..." : transactions.length}</h2>
                        <p>Recorded transactions</p>
                    </div>

                </div>

                {/* ANALYTICS */}

                {!loading && (
                    <div className="analytics-grid">

                        {/* INCOME VS EXPENSE */}

                        <section className="analytics-card">
                            <h2>Income vs Expenses</h2>
                            <p className="analytics-subtitle">
                                Compare your total money received and spent
                            </p>

                            <div className="comparison-item">
                                <div className="comparison-label">
                                    <span>Income</span>
                                    <strong>{formatAmount(summary.totalIncome)}</strong>
                                </div>

                                <div className="comparison-track">
                                    <div
                                        className="comparison-fill income-fill"
                                        style={{ width: `${incomeWidth}%` }}
                                    />
                                </div>
                            </div>

                            <div className="comparison-item">
                                <div className="comparison-label">
                                    <span>Expenses</span>
                                    <strong>{formatAmount(summary.totalExpense)}</strong>
                                </div>

                                <div className="comparison-track">
                                    <div
                                        className="comparison-fill expense-fill"
                                        style={{ width: `${expenseWidth}%` }}
                                    />
                                </div>
                            </div>

                            <div className="comparison-footer">
                                <span>Net Balance</span>
                                <strong>{formatAmount(summary.balance)}</strong>
                            </div>
                        </section>

                        {/* CATEGORY BREAKDOWN */}

                        <section className="analytics-card">
                            <h2>Expense Categories</h2>
                            <p className="analytics-subtitle">
                                See where your money goes
                            </p>

                            {categoryData.length === 0 ? (
                                <p className="empty-analytics">
                                    No expense data available.
                                </p>
                            ) : (
                                <div className="category-list">
                                    {categoryData.map((item) => (
                                        <div
                                            className="category-item"
                                            key={item.category}
                                        >
                                            <div className="category-info">
                                                <span>{item.category}</span>
                                                <strong>
                                                    {formatAmount(item.amount)}
                                                </strong>
                                            </div>

                                            <div className="category-track">
                                                <div
                                                    className="category-fill"
                                                    style={{
                                                        width: `${(item.amount / maxCategoryAmount) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>
                )}

                {/* RECENT TRANSACTIONS */}

                <section className="recent-transactions">
                    <div className="recent-heading">
                        <div>
                            <h2>Recent Transactions</h2>
                            <p>Your latest financial activities</p>
                        </div>

                        <Link to="/transactions" className="view-all-link">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : transactions.length === 0 ? (
                        <div className="empty-transactions">
                            <span>🧾</span>
                            <h3>No transactions yet</h3>
                            <p>Add your first income or expense.</p>
                            <Link to="/add-transaction">
                                Add Transaction
                            </Link>
                        </div>
                    ) : (
                        <div className="transaction-list">
                            {transactions.slice(0, 5).map((transaction) => (
                                <div
                                    className="transaction-item"
                                    key={transaction.id}
                                >
                                    <div className="transaction-details">
                                        <div className={
                                            transaction.type === "INCOME"
                                                ? "transaction-icon income-icon"
                                                : "transaction-icon expense-icon"
                                        }>
                                            {transaction.type === "INCOME" ? "↙" : "↗"}
                                        </div>

                                        <div>
                                            <h4>{transaction.category}</h4>
                                            <p>{transaction.description || "No description"}</p>
                                            <small>{transaction.transactionDate}</small>
                                        </div>
                                    </div>

                                    <h4 className={
                                        transaction.type === "INCOME"
                                            ? "income-amount"
                                            : "expense-amount"
                                    }>
                                        {transaction.type === "INCOME" ? "+" : "-"}
                                        {formatAmount(transaction.amount)}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </main>
        </div>
    );
}

export default Dashboard;
