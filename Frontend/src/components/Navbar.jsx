import { useNavigate, NavLink } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h2 onClick={() => navigate("/dashboard")}>
                Personal Expense Tracker
            </h2>

            <div className="navbar-links">
                <NavLink to="/dashboard">Dashboard</NavLink>

                <NavLink to="/transactions">All Transactions</NavLink>

                <NavLink to="/add-transaction">Add Transaction</NavLink>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;