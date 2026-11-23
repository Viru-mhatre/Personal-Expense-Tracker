
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/API";
import "./AddTransaction.css";

function AddTransaction() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        type: "EXPENSE",
        category: "",
        amount: "",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0]
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Submit transaction
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // Validate amount
        if (!formData.amount || Number(formData.amount) <= 0) {
            setError("Amount must be greater than zero.");
            return;
        }

        // Validate category
        if (!formData.category) {
            setError("Please select a category.");
            return;
        }

        try {

            setLoading(true);

            const transactionData = {
                type: formData.type,
                category: formData.category,
                amount: Number(formData.amount),
                description: formData.description,
                transactionDate: formData.transactionDate
            };

            console.log("Sending Transaction:", transactionData);

            // POST API
            const response = await api.post(
                "/transactions",
                transactionData
            );

            console.log("Transaction Added:", response.data);

            alert("Transaction added successfully!");

            // Redirect to transactions page
            navigate("/transactions");

        } catch (err) {

            console.error("Full Error:", err);

            console.log("Status:", err.response?.status);

            console.log("Response Data:", err.response?.data);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : null) ||
                err.message ||
                "Failed to add transaction."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="add-transaction-container">

            <div className="add-transaction-card">

                <h2>Add New Transaction</h2>

                <p className="form-subtitle">
                    Record your income and expenses
                </p>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Transaction Type */}
                    <div className="form-group">

                        <label>Transaction Type</label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>

                    </div>

                    {/* Amount */}
                    <div className="form-group">

                        <label>Amount (₹)</label>

                        <input
                            type="number"
                            name="amount"
                            placeholder="Enter amount"
                            value={formData.amount}
                            onChange={handleChange}
                            min="0.01"
                            step="0.01"
                            required
                        />

                    </div>

                    {/* Category */}
                    <div className="form-group">

                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>

                            <option value="Food">Food</option>
                            <option value="Salary">Salary</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Bills">Bills</option>
                            <option value="Health">Health</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>

                        </select>

                    </div>

                    {/* Description */}
                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            name="description"
                            placeholder="Enter transaction description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />

                    </div>

                    {/* Transaction Date */}
                    <div className="form-group">

                        <label>Transaction Date</label>

                        <input
                            type="date"
                            name="transactionDate"
                            value={formData.transactionDate}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Buttons */}
                    <div className="form-buttons">

                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? "Saving..." : "Add Transaction"}
                        </button>

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/transactions")}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default AddTransaction;
