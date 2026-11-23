
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/API";
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
    const [error, setError] = useState("");

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
                setError("Failed to load transaction details.");
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.category.trim() || Number(form.amount) <= 0) {
            setError("Please enter a valid category and amount.");
            return;
        }

        try {
            const transactionData = {
                ...form,
                amount: Number(form.amount)
            };

            await api.put(`/transactions/${id}`, transactionData);

            alert("Transaction updated successfully!");
            navigate("/transactions");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to update transaction."
            );
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

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Transaction Type</label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                            >
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                            </select>
                        </div>

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

                        <div className="form-group">
                            <label>Amount</label>
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

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                maxLength="500"
                            />
                        </div>

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

                        <div className="form-buttons">
                            <button type="submit" className="submit-btn">
                                Update Transaction
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
        </div>
    );
}

export default EditTransaction;
