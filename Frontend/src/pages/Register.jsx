
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/AuthService";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validation
    const validateField = (name, value, data = formData) => {
        switch (name) {
            case "name":
                if (!value.trim()) {
                    return "Username is required.";
                }
                if (value.trim().length < 3 || value.trim().length > 25) {
                    return "Username must be between 3 and 25 characters.";
                }
               if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value.trim())) {
                return "Username can contain only letters and spaces.";
                }
                return "";

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
                if (
                    value.length < 8 ||
                    !/[a-z]/.test(value) ||
                    !/[A-Z]/.test(value) ||
                    !/[0-9]/.test(value) ||
                    !/[^A-Za-z0-9]/.test(value)
                ) {
                    return "Password must contain 8 characters, uppercase, lowercase, number and special character.";
                }
                return "";

            case "confirmPassword":
                if (!value) {
                    return "Please enter the password again.";
                }
                if (value !== data.password) {
                    return "Passwords do not match.";
                }
                return "";

            default:
                return "";
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...formData,
            [name]: value
        };

        setFormData(updatedData);

        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value, updatedData)
            }));
        }

        if (name === "password" && touched.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: validateField(
                    "confirmPassword",
                    updatedData.confirmPassword,
                    updatedData
                )
            }));
        }
    };

    const registeredEmail = formData.email.trim().toLowerCase();

localStorage.removeItem(`dashboardVisited_${registeredEmail}`);
localStorage.setItem(`isNewDashboardUser_${registeredEmail}`, "true");

    // Handle blur
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

    // Handle registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        const allTouched = {
            name: true,
            email: true,
            password: true,
            confirmPassword: true
        };

        setTouched(allTouched);

        const newErrors = {};

        Object.keys(formData).forEach(field => {
            newErrors[field] = validateField(
                field,
                formData[field],
                formData
            );
        });

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error !== "")) {
            return;
        }

        setLoading(true);

        try {
            await registerUser({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            await Swal.fire({
                icon: "success",
                title: "Registration Successful!",
                text: "Your account has been created successfully. Please login to continue.",
                confirmButtonText: "Go to Login",
                confirmButtonColor: "#4f46e5"
            });

            sessionStorage.removeItem("hasVisitedLogin");
            navigate("/login");

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Registration Failed!",
                text:
                    err.response?.data?.message ||
                    "This account already exists. Please login or use another email address.",
                confirmButtonColor: "#4f46e5"
            });
        } finally {
            setLoading(false);
        }
    };

    // Input validation classes
    const getInputClass = (field) => {
        if (!touched[field]) return "";
        if (errors[field]) return "input-invalid";
        return "input-valid";
    };

    return (
        <div className="register-container">
            <div className="register-card">

                <h2>Create Account</h2>
                <p>Start managing your money today</p>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* Username */}
                    <div className="register-field">
                        <label htmlFor="name">Username</label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your username"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClass("name")}
                        />

                        {touched.name && errors.name && (
                            <small className="register-validation-error">
                                {errors.name}
                            </small>
                        )}
                    </div>

                    {/* Email */}
                    <div className="register-field">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClass("email")}
                        />

                        {touched.email && errors.email && (
                            <small className="register-validation-error">
                                {errors.email}
                            </small>
                        )}
                    </div>

                    {/* Password */}
                    <div className="register-field">
                        <label htmlFor="password">Password</label>

                        <div className={`register-password-field ${getInputClass("password")}`}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Minimum 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            <button
                                type="button"
                                className="register-toggle-password"
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {touched.password && errors.password && (
                            <small className="register-validation-error">
                                {errors.password}
                            </small>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="register-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>

                        <div className={`register-password-field ${getInputClass("confirmPassword")}`}>
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />

                            <button
                                type="button"
                                className="register-toggle-password"
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {touched.confirmPassword && errors.confirmPassword && (
                            <small className="register-validation-error">
                                {errors.confirmPassword}
                            </small>
                        )}
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="register-submit-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <div className="register-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>

            </div>
        </div>
    );
}

export default Register;
