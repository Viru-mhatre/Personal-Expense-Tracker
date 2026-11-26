
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/transactions" element={<Transactions />} />

                    <Route path="/add-transaction" element={<AddTransaction />} />

                    <Route path="/edit-transaction/:id" element={<EditTransaction />}/>

                    

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
