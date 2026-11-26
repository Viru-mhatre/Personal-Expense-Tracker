
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/API";
import Swal from "sweetalert2";
import "./AddTransaction.css";

function AddTransaction() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        type: "",
        category: "",
        amount: "",
        description: "",
        transactionDate: new Date().toISOString().split("T")[0]
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validate individual fields
    const validateField = (name, value) => {

        switch (name) {

            case "type":
                return value ? "" : "Please select a transaction type.";

            case "amount":
                if (!value || value.trim() === "") {
                    return "Please enter an amount.";
                }

                if (!Number.isFinite(Number(value)) || Number(value) <= 0) {
                    return "Amount must be greater than 0.";
                }

                return "";

            case "category":
                return value ? "" : "Please select a category.";

            case "description":
                return value.trim() === ""
                    ? "Please enter a transaction description."
                    : "";

            case "transactionDate":
                return value ? "" : "Please select a transaction date.";

            default:
                return "";
        }
    };

    // Validate entire form
    const validateForm = () => {

        const newErrors = {};

        Object.keys(formData).forEach((field) => {

            const error = validateField(field, formData[field]);

            if (error) {
                newErrors[field] = error;
            }

        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        // Validate field if user has already interacted with it
        if (touched[name]) {

            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validateField(name, value)
            }));

        }

    };

    // Handle blur
    const handleBlur = (e) => {

        const { name, value } = e.target;

        setTouched((prevTouched) => ({
            ...prevTouched,
            [name]: true
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value)
        }));

    };

    // Submit transaction
    const handleSubmit = async (e) => {

        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            type: true,
            amount: true,
            category: true,
            description: true,
            transactionDate: true
        });

        // Validate all fields
        if (!validateForm()) {
            return;
        }

        try {

            setLoading(true);

            const transactionData = {
                type: formData.type,
                category: formData.category,
                amount: Number(formData.amount),
                description: formData.description.trim(),
                transactionDate: formData.transactionDate
            };

            console.log("Sending Transaction:", transactionData);

            // POST API
            const response = await api.post(
                "/transactions",
                transactionData
            );

            console.log("Transaction Added:", response.data);

            await Swal.fire({
                icon: "success",
                title: "Transaction Added!",
                text: "Your transaction has been added successfully.",
                confirmButtonColor: "#4f46e5"
            });

            navigate("/transactions");

        } catch (err) {

            console.error("Full Error:", err);
            console.log("Status:", err.response?.status);
            console.log("Response Data:", err.response?.data);

            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : null) ||
                "Failed to add transaction.";

            await Swal.fire({
                icon: "error",
                title: "Transaction Failed!",
                text: errorMessage,
                confirmButtonColor: "#4f46e5"
            });

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

                <form onSubmit={handleSubmit} noValidate>

                    {/* Transaction Type */}
                    <div className="form-group">

                        <label>Transaction Type</label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.type ? "input-error" : ""}
                        >
                            <option value="" disabled>
                                --Select Type--
                            </option>

                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>

                        {errors.type && (
                            <small className="field-error">
                                {errors.type}
                            </small>
                        )}

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
                            onBlur={handleBlur}
                            min="0.01"
                            step="0.01"
                            className={errors.amount ? "input-error" : ""}
                        />

                        {errors.amount && (
                            <small className="field-error">
                                {errors.amount}
                            </small>
                        )}

                    </div>

                    {/* Category */}
                    <div className="form-group">

                        <label>Category</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.category ? "input-error" : ""}
                        >
                            <option value="" disabled>
                                --Select Category--
                            </option>

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

                        {errors.category && (
                            <small className="field-error">
                                {errors.category}
                            </small>
                        )}

                    </div>

                    {/* Description */}
                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            name="description"
                            placeholder="Enter transaction description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows="3"
                            className={errors.description ? "input-error" : ""}
                        />

                        {errors.description && (
                            <small className="field-error">
                                {errors.description}
                            </small>
                        )}

                    </div>

                    {/* Transaction Date */}
                    <div className="form-group">

                        <label>Transaction Date</label>

                        <input
                            type="date"
                            name="transactionDate"
                            value={formData.transactionDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.transactionDate ? "input-error" : ""}
                        />

                        {errors.transactionDate && (
                            <small className="field-error">
                                {errors.transactionDate}
                            </small>
                        )}

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
