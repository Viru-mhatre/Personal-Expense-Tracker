
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
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    // Returning User Check
    const [isReturningUser] = useState(
        sessionStorage.getItem("hasVisitedLogin") === "true"
    );

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validate Field
    const validateField = (name, value) => {
        switch (name) {
            case "email":
                if (!value.trim()) {
                    return "Email is required.";
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                    return "Please enter a valid email address.";
                }

                return "";

            case "password":
                if (!value) {
                    return "Password is required.";
                }

                if (value.length < 8) {
                    return "Password must contain at least 8 characters.";
                }

                return "";

            default:
                return "";
        }
    };

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear backend login error
        setError("");

        // Validate touched fields
        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    // Handle Blur
    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

// Handle Login
const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Mark all fields touched
    const allTouched = {
        email: true,
        password: true
    };

    setTouched(allTouched);

    // Validate all fields
    const newErrors = {
        email: validateField("email", formData.email),
        password: validateField("password", formData.password)
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err !== "")) {
        return;
    }

    setLoading(true);

    try {
        const response = await loginUser({
            email: formData.email.trim(),
            password: formData.password
        });

        // Store logged-in user details
        localStorage.setItem("userName", response.name);
        localStorage.setItem("userEmail", response.email);

        // Mark user as visited
        sessionStorage.setItem("hasVisitedLogin", "true");

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
    // Input Styling
    const getInputClass = (field) => {
        if (!touched[field]) return "";
        if (errors[field]) return "input-invalid";
        return "input-valid";
    };

    return (
        <div className="login-container">
            <div className="login-card">

                {/* Welcome Heading */}
                <h1>
                    {isReturningUser
                        ? "Welcome Back"
                        : "Welcome"}
                </h1>

                <p>Login to manage your expenses</p>

                {/* Backend Error */}
                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* Email */}
                    <div className="login-field">
                        <label htmlFor="email">Email Address</label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="email"
                            className={getInputClass("email")}
                        />

                        {touched.email && errors.email && (
                            <small className="login-validation-error">
                                {errors.email}
                            </small>
                        )}
                    </div>

                    {/* Password */}
                    <div className="login-field">
                        <label htmlFor="password">Password</label>

                        <div className={`login-password-field ${getInputClass("password")}`}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="login-toggle-password"
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {touched.password && errors.password && (
                            <small className="login-validation-error">
                                {errors.password}
                            </small>
                        )}
                    </div>

                    <div className="forgot-password-link">
    <Link to="/forgot-password">
        Forgot Password?
    </Link>
</div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="login-submit-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Register Link */}
                <div className="login-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
