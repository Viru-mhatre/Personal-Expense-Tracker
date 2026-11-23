
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { loginUser } from "../services/AuthService";

// function Login() {

//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         email: "",
//         password: ""
//     });

//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         try {
//             await loginUser(formData);
//             navigate("/dashboard");
//         } catch (err) {
//             setError(
//                 err.response?.data?.message ||
//                 "Invalid email or password"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-card">

//                 <h1>Welcome Back!</h1>
//                 <p>Login to manage your expenses</p>

//                 {error && <div className="error">{error}</div>}

//                 <form onSubmit={handleSubmit}>

//                     <label>Email Address</label>
//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="Enter your email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                     />

//                     <label>Password</label>
//                     <input
//                         type="password"
//                         name="password"
//                         placeholder="Enter your password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                     />

//                     <button type="submit" disabled={loading}>
//                         {loading ? "Logging in..." : "Login"}
//                     </button>

//                 </form>

//                 <p className="auth-link">
//                     Don't have an account?
//                     <Link to="/register"> Register</Link>
//                 </p>

//             </div>
//         </div>
//     );
// }

// export default Login;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";
import { Eye, EyeOff } from "lucide-react";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginUser(formData);
            navigate("/dashboard");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1>Welcome Back!</h1>
                <p>Login to manage your expenses</p>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <label>Email Address</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>

<div className="password-field">
    <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        required
    />

    <button
        type="button"
        className="toggle-password"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
    >
        {showPassword ? (
            <EyeOff size={20} />
        ) : (
            <Eye size={20} />
        )}
    </button>
</div>

                    {/* Login Button */}
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="auth-link">
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
