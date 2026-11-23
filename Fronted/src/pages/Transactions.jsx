
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/API";
import "./Transactions.css";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await api.get("/transactions", { params });

            setTransactions(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    const categories = [
        ...new Set(
            transactions
                .map((transaction) => transaction.category)
                .filter(Boolean)
        )
    ].sort();

    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        if (search.trim()) {
            const searchText = search.toLowerCase();

            result = result.filter((transaction) =>
                transaction.category?.toLowerCase().includes(searchText) ||
                transaction.description?.toLowerCase().includes(searchText)
            );
        }

        if (typeFilter !== "ALL") {
            result = result.filter(
                (transaction) => transaction.type === typeFilter
            );
        }

        if (categoryFilter !== "ALL") {
            result = result.filter(
                (transaction) => transaction.category === categoryFilter
            );
        }

        return result;
    }, [transactions, search, typeFilter, categoryFilter]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/transactions/${id}`);

            setTransactions((previous) =>
                previous.filter((transaction) => transaction.id !== id)
            );
        } catch (err) {
            console.error(err);
            alert("Failed to delete transaction.");
        }
    };

    const clearFilters = () => {
        setSearch("");
        setTypeFilter("ALL");
        setCategoryFilter("ALL");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div>
            <Navbar />

            <main className="transactions-page">

                <div className="transactions-heading">
                    <div>
                        <h1>All Transactions</h1>
                        <p>Track and manage your income and expenses.</p>
                    </div>

                    
                </div>

                {error && <p className="error">{error}</p>}

                {/* FILTER SECTION */}

                <section className="transaction-filters">

                    <div className="search-box">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search category or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="ALL">All Categories</option>

                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={startDate}
                        max={endDate || undefined}
                        onChange={(e) => setStartDate(e.target.value)}
                        aria-label="Start Date"
                        title="Start Date"
                    />

                    <input
                        type="date"
                        value={endDate}
                        min={startDate || undefined}
                        onChange={(e) => setEndDate(e.target.value)}
                        aria-label="End Date"
                        title="End Date"
                    />

                </section>

                {/* TRANSACTION LIST */}

                <section className="transactions-list-card">

                    <div className="transactions-list-heading">
                        <div>
                            <h2>Transaction History</h2>
                            <p>
                                {filteredTransactions.length} transaction(s) found
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="transaction-message">
                            Loading transactions...
                        </p>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="transaction-empty">
                            <span>🧾</span>
                            <h3>No transactions found</h3>
                            <p>Try changing your search or filters.</p>

                            <button onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="transaction-list">

                            {filteredTransactions.map((transaction) => (
                                <div
                                    className="managed-transaction-item"
                                    key={transaction.id}
                                >

                                    <div className="managed-transaction-details">

                                        <div className={
                                            transaction.type === "INCOME"
                                                ? "transaction-icon income-icon"
                                                : "transaction-icon expense-icon"
                                        }>
                                            {transaction.type === "INCOME" ? "↙" : "↗"}
                                        </div>

                                        <div>
                                            <h4>{transaction.category}</h4>

                                            <p>
                                                {transaction.description || "No description"}
                                            </p>

                                            <small>
                                                {transaction.transactionDate}
                                            </small>
                                        </div>

                                    </div>

                                    <div className="managed-transaction-actions">

                                        <h4 className={
                                            transaction.type === "INCOME"
                                                ? "income-amount"
                                                : "expense-amount"
                                        }>
                                            {transaction.type === "INCOME" ? "+" : "-"}
                                            {formatAmount(transaction.amount)}
                                        </h4>

                                        <div className="action-buttons">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/edit-transaction/${transaction.id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(transaction.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default Transactions;
