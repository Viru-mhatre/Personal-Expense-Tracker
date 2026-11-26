
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/API";
import Swal from "sweetalert2";
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

    // Fetch transactions
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

    // Format amount
    const formatAmount = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

    // Categories
    const categories = [
        ...new Set(
            transactions
                .map((transaction) => transaction.category)
                .filter(Boolean)
        )
    ].sort();

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        if (search.trim()) {
            const searchText = search.toLowerCase();

            result = result.filter(
                (transaction) =>
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

    // Delete transaction with SweetAlert2
    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            icon: "warning",
            title: "Are you sure?",
            text: "You won't be able to recover this transaction!",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#e34d59",
            cancelButtonColor: "#6b7280",
            reverseButtons: true
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            await api.delete(`/transactions/${id}`);

            setTransactions((previous) =>
                previous.filter((transaction) => transaction.id !== id)
            );

            await Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Transaction deleted successfully.",
                confirmButtonColor: "#4f46e5"
            });
        } catch (err) {
            console.error(err);

            Swal.fire({
                icon: "error",
                title: "Delete Failed!",
                text:
                    err.response?.data?.message ||
                    "Failed to delete transaction.",
                confirmButtonColor: "#4f46e5"
            });
        }
    };

    // Clear filters
    const clearFilters = () => {
        setSearch("");
        setTypeFilter("ALL");
        setCategoryFilter("ALL");
        setStartDate("");
        setEndDate("");
    };

    return (
        <>
            <Navbar />

            <div className="transactions-page">

                {/* Header */}
                <div className="transactions-header">
                    <div>
                        <h1>All Transactions</h1>
                        <p>View and manage your income and expenses.</p>
                    </div>

                    
                </div>

                {/* Error */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="transaction-filters">

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search category or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="INCOME">Income</option>
                        <option value="EXPENSE">Expense</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(e.target.value)
                        }
                    >
                        <option value="ALL">All Categories</option>

                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Start Date */}
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />

                    {/* End Date */}
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />

                    {/* Clear Filters */}
                    <button
                        className="clear-filter-btn"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Transactions List */}
                <div className="transactions-list">

                    {loading ? (
                        <div className="loading-message">
                            Loading transactions...
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="empty-message">
                            <h3>No Transactions Found</h3>
                            <p>
                                Try changing your filters or add a new transaction.
                            </p>
                        </div>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <div
                                className="transaction-card"
                                key={transaction.id}
                            >
                                <div className="transaction-info">
                                    <h3>
                                        {transaction.category}
                                    </h3>

                                    <p>
                                        {transaction.description ||
                                            "No description"}
                                    </p>

                                    <span className="transaction-date">
                                        {transaction.transactionDate}
                                    </span>
                                </div>

                                <div className="transaction-right">
                                    <div
                                        className={`transaction-amount ${
                                            transaction.type === "INCOME"
                                                ? "income"
                                                : "expense"
                                        }`}
                                    >
                                        {transaction.type === "INCOME"
                                            ? "+"
                                            : "-"}
                                        {formatAmount(transaction.amount)}
                                    </div>

                                    <div className="transaction-actions">

                                        {/* Edit Button */}
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

                                        {/* Delete Button */}
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
                        ))
                    )}

                </div>

            </div>
        </>
    );
}

export default Transactions;
