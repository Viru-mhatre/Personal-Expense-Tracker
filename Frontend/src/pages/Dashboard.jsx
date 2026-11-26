
import { useEffect, useRef, useState } from "react";
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
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const welcomeInitialized = useRef(false);
// Dynamic Welcome Message
useEffect(() => {

    // Prevent React StrictMode from running this logic twice
    if (welcomeInitialized.current) {
        return;
    }

    welcomeInitialized.current = true;

    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        setWelcomeMessage(
            "Welcome Sir! Here's your financial summary."
        );
        return;
    }

    const normalizedEmail = userEmail.trim().toLowerCase();

    const visitedKey = `dashboardVisited_${normalizedEmail}`;
    const newUserKey = `isNewDashboardUser_${normalizedEmail}`;

    const isNewUser = localStorage.getItem(newUserKey);
    const hasVisited = localStorage.getItem(visitedKey);

    if (isNewUser === "true" || !hasVisited) {

        setWelcomeMessage(
            "Welcome! Here's your financial summary."
        );

        localStorage.setItem(visitedKey, "true");
        localStorage.removeItem(newUserKey);

    } else {

        setWelcomeMessage(
            `Welcome Back ${userName || "User"}! Here's your financial summary.`
        );
    }

}, []);
    // Fetch Dashboard Data
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

    // Format Amount
    const formatAmount = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    // Expense Category Totals
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

    // Income and Expense Comparison
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

                {/* DASHBOARD HEADING */}

                <div className="dashboard-heading">
                    <div>
                        <h1>Dashboard Overview</h1>
                        <p>{welcomeMessage}</p>
                    </div>
                </div>

                {error && <p className="error">{error}</p>}

                {/* SUMMARY CARDS */}

                <div className="dashboard-cards">

                    <div className="dashboard-card balance-card">
                        <div className="card-icon">💰</div>
                        <h3>Total Balance</h3>
                        <h2>
                            {loading
                                ? "Loading..."
                                : formatAmount(summary.balance)}
                        </h2>
                        <p>Your available balance</p>
                    </div>

                    <div className="dashboard-card income-card">
                        <div className="card-icon">📈</div>
                        <h3>Total Income</h3>
                        <h2>
                            {loading
                                ? "Loading..."
                                : formatAmount(summary.totalIncome)}
                        </h2>
                        <p>Money received</p>
                    </div>

                    <div className="dashboard-card expense-card">
                        <div className="card-icon">📉</div>
                        <h3>Total Expenses</h3>
                        <h2>
                            {loading
                                ? "Loading..."
                                : formatAmount(summary.totalExpense)}
                        </h2>
                        <p>Money spent</p>
                    </div>

                    <div className="dashboard-card count-card">
                        <div className="card-icon">🧾</div>
                        <h3>Total Transactions</h3>
                        <h2>
                            {loading
                                ? "Loading..."
                                : transactions.length}
                        </h2>
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
                                    <strong>
                                        {formatAmount(summary.totalIncome)}
                                    </strong>
                                </div>

                                <div className="comparison-track">
                                    <div
                                        className="comparison-fill income-fill"
                                        style={{
                                            width: `${incomeWidth}%`
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="comparison-item">
                                <div className="comparison-label">
                                    <span>Expenses</span>
                                    <strong>
                                        {formatAmount(summary.totalExpense)}
                                    </strong>
                                </div>

                                <div className="comparison-track">
                                    <div
                                        className="comparison-fill expense-fill"
                                        style={{
                                            width: `${expenseWidth}%`
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="comparison-footer">
                                <span>Net Balance</span>
                                <strong>
                                    {formatAmount(summary.balance)}
                                </strong>
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
                                                <span>
                                                    {item.category}
                                                </span>

                                                <strong>
                                                    {formatAmount(item.amount)}
                                                </strong>
                                            </div>

                                            <div className="category-track">
                                                <div
                                                    className="category-fill"
                                                    style={{
                                                        width: `${
                                                            (item.amount /
                                                                maxCategoryAmount) *
                                                            100
                                                        }%`
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

                <section
                    style={{
                        background: "#ffffff",
                        border: "1px solid #e8ecf4",
                        borderRadius: "18px",
                        padding: "25px",
                        marginTop: "30px",
                        boxShadow: "0 5px 22px rgba(31, 45, 80, 0.04)"
                    }}
                >
                    {/* HEADER */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "15px",
                            marginBottom: "22px"
                        }}
                    >
                        <div>
                            <h2 style={{ marginBottom: "7px" }}>
                                Recent Transactions
                            </h2>

                            <p style={{
                                color: "#8490a5",
                                fontSize: "13px"
                            }}>
                                Your latest financial activities
                            </p>
                        </div>

                        <Link
                            to="/transactions"
                            style={{
                                color: "#4f46e5",
                                fontSize: "13px",
                                fontWeight: "700",
                                whiteSpace: "nowrap"
                            }}
                        >
                            View All →
                        </Link>
                    </div>

                    {/* LOADING */}

                    {loading ? (
                        <p>Loading transactions...</p>
                    ) : transactions.length === 0 ? (
                        /* EMPTY STATE */

                        <div style={{
                            textAlign: "center",
                            padding: "35px 15px"
                        }}>
                            <span style={{ fontSize: "40px" }}>
                                🧾
                            </span>

                            <h3 style={{ margin: "12px 0 7px" }}>
                                No transactions yet
                            </h3>

                            <p style={{
                                color: "#8490a5",
                                fontSize: "13px",
                                marginBottom: "17px"
                            }}>
                                Add your first income or expense.
                            </p>

                            <Link
                                to="/add-transaction"
                                style={{
                                    display: "inline-block",
                                    background: "#4f46e5",
                                    color: "white",
                                    padding: "10px 17px",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: "700"
                                }}
                            >
                                Add Transaction
                            </Link>
                        </div>
                    ) : (
                        /* TRANSACTION LIST */

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%"
                        }}>
                            {transactions.slice(0, 5).map((transaction) => (
                                <div
                                    key={transaction.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        gap: "15px",
                                        padding: "18px 10px",
                                        borderBottom: "1px solid #edf0f6"
                                    }}
                                >
                                    {/* TRANSACTION DETAILS */}

                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: "14px",
                                        minWidth: "0"
                                    }}>
                                        {/* ICON */}

                                        <div
                                            style={{
                                                width: "45px",
                                                height: "45px",
                                                minWidth: "45px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "12px",
                                                fontSize: "20px",
                                                fontWeight: "800",
                                                color:
                                                    transaction.type === "INCOME"
                                                        ? "#16a36a"
                                                        : "#e34d59",
                                                background:
                                                    transaction.type === "INCOME"
                                                        ? "#e7f8ef"
                                                        : "#fff0f0"
                                            }}
                                        >
                                            {transaction.type === "INCOME"
                                                ? "↙"
                                                : "↗"}
                                        </div>

                                        {/* DETAILS */}

                                        <div style={{ minWidth: "0" }}>
                                            <h4 style={{
                                                color: "#26334d",
                                                fontSize: "14px",
                                                fontWeight: "700",
                                                marginBottom: "5px"
                                            }}>
                                                {transaction.category}
                                            </h4>

                                            <p style={{
                                                color: "#64748b",
                                                fontSize: "13px",
                                                marginBottom: "5px"
                                            }}>
                                                {transaction.description ||
                                                    "No description"}
                                            </p>

                                            <small style={{
                                                color: "#94a3b8",
                                                fontSize: "12px"
                                            }}>
                                                {transaction.transactionDate}
                                            </small>
                                        </div>
                                    </div>

                                    {/* AMOUNT */}

                                    <h4 style={{
                                        fontSize: "15px",
                                        fontWeight: "800",
                                        whiteSpace: "nowrap",
                                        textAlign: "right",
                                        color:
                                            transaction.type === "INCOME"
                                                ? "#16a36a"
                                                : "#ef4444"
                                    }}>
                                        {transaction.type === "INCOME"
                                            ? "+"
                                            : "-"}
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
