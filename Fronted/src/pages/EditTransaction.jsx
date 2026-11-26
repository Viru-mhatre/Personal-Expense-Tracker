
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/API";
import Swal from "sweetalert2";
import "./EditTransaction.css";

function EditTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        type: "EXPENSE",
        category: "",
        amount: "",
        description: "",
        transactionDate: ""
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Fetch existing transaction
    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await api.get(`/transactions/${id}`);

                setForm({
                    type: response.data.type,
                    category: response.data.category,
                    amount: response.data.amount,
                    description: response.data.description || "",
                    transactionDate: response.data.transactionDate
                });

            } catch (err) {
                console.error(err);

                await Swal.fire({
                    icon: "error",
                    title: "Failed to Load!",
                    text: "Unable to load transaction details.",
                    confirmButtonColor: "#4f46e5"
                });

                navigate("/transactions");

            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [id, navigate]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Handle Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate category
        if (!form.category.trim()) {
            await Swal.fire({
                icon: "warning",
                title: "Category Required!",
                text: "Please enter a category.",
                confirmButtonColor: "#4f46e5"
            });
            return;
        }

        // Validate amount
        if (!form.amount || Number(form.amount) <= 0) {
            await Swal.fire({
                icon: "warning",
                title: "Invalid Amount!",
                text: "Amount must be greater than zero.",
                confirmButtonColor: "#4f46e5"
            });
            return;
        }

        // Validate transaction date
        if (!form.transactionDate) {
            await Swal.fire({
                icon: "warning",
                title: "Date Required!",
                text: "Please select a transaction date.",
                confirmButtonColor: "#4f46e5"
            });
            return;
        }

        try {
            setSubmitting(true);

            const transactionData = {
                ...form,
                category: form.category.trim(),
                amount: Number(form.amount)
            };

            await api.put(`/transactions/${id}`, transactionData);

            await Swal.fire({
                icon: "success",
                title: "Transaction Updated!",
                text: "Your transaction has been updated successfully.",
                confirmButtonColor: "#4f46e5"
            });

            navigate("/transactions");

        } catch (err) {
            console.error("Update Error:", err);

            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : null) ||
                "Failed to update transaction.";

            await Swal.fire({
                icon: "error",
                title: "Update Failed!",
                text: errorMessage,
                confirmButtonColor: "#4f46e5"
            });

        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading transaction...</p>;
    }

    return (
        <div>
            <Navbar />

            <div className="edit-transaction-container">
                <div className="edit-transaction-card">

                    <h2>Edit Transaction</h2>

                    <form onSubmit={handleSubmit}>

                        {/* Transaction Type */}
                        <div className="form-group">
                            <label>Transaction Type</label>

                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label>Category</label>

                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Amount */}
                        <div className="form-group">
                            <label>Amount (₹)</label>

                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label>Description</label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength="500"
                            />
                        </div>

                        {/* Transaction Date */}
                        <div className="form-group">
                            <label>Transaction Date</label>

                            <input
                                type="date"
                                name="transactionDate"
                                value={form.transactionDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Updating..."
                                    : "Update Transaction"}
                            </button>

                            <button
                                type="button"
                                className="cancel-btn"
                                disabled={submitting}
                                onClick={() => navigate("/transactions")}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditTransaction;
