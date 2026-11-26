
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import api from "../services/API";
import "./ForgotPassword.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // CHECK EMAIL
    const handleCheckEmail = async (e) => {

        e.preventDefault();

        setEmailError("");

        if (!email.trim()) {
            setEmailError("Email is required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        try {

            const response = await api.post("/auth/check-email", {
                email: email.trim()
            });

            if (response.status === 200) {

                setEmailVerified(true);

                Swal.fire({
                    icon: "success",
                    title: "Email Verified",
                    text: "Please enter your new password.",
                    timer: 1500,
                    showConfirmButton: false
                });
            }

        } catch (error) {

            setEmailError(
                error.response?.data || "Email is not registered."
            );
        }
    };

    // RESET PASSWORD
    const handleResetPassword = async (e) => {

        e.preventDefault();

        setPasswordError("");
        setConfirmPasswordError("");

        if (!newPassword) {
            setPasswordError("New password is required.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters.");
            return;
        }

        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
            setPasswordError(
                "Password must contain uppercase, lowercase, number and special character."
            );
            return;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }

        try {

            const response = await api.post("/auth/reset-password", {
                email: email.trim(),
                newPassword: newPassword
            });

            if (response.status === 200) {

                await Swal.fire({
                    icon: "success",
                    title: "Password Reset Successfully!",
                    text: "You can now login with your new password.",
                    confirmButtonText: "Go to Login"
                });

                navigate("/login");
            }

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Reset Failed",
                text: error.response?.data || "Unable to reset password."
            });
        }
    };

    return (
        <div className="forgot-password-container">

            <div className="forgot-password-card">

                <div className="forgot-password-header">

                    <h2>Forgot Password?</h2>

                    <p>
                        {emailVerified
                            ? "Create a new password for your account."
                            : "Enter your registered email address to reset your password."}
                    </p>

                </div>

                {!emailVerified ? (

                    <form onSubmit={handleCheckEmail}>

                        <div className="forgot-form-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError("");
                                }}
                            />

                            {emailError && (
                                <span className="forgot-error">
                                    {emailError}
                                </span>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="forgot-submit-btn"
                        >
                            Verify Email
                        </button>

                    </form>

                ) : (

                    <form onSubmit={handleResetPassword}>

                        <div className="forgot-verified-email">
                            <span>Registered Email</span>
                            <strong>{email}</strong>
                        </div>

                        <div className="forgot-form-group">

                            <label>New Password</label>

                            <div className="forgot-password-input">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setPasswordError("");
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="forgot-eye-btn"
                                >
                                    {showPassword
                                        ? <EyeOff size={20}/>
                                        : <Eye size={20}/>
                                    }
                                </button>

                            </div>

                            {passwordError && (
                                <span className="forgot-error">
                                    {passwordError}
                                </span>
                            )}

                        </div>

                        <div className="forgot-form-group">

                            <label>Confirm Password</label>

                            <div className="forgot-password-input">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setConfirmPasswordError("");
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="forgot-eye-btn"
                                >
                                    {showConfirmPassword
                                        ? <EyeOff size={20}/>
                                        : <Eye size={20}/>
                                    }
                                </button>

                            </div>

                            {confirmPasswordError && (
                                <span className="forgot-error">
                                    {confirmPasswordError}
                                </span>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="forgot-submit-btn"
                        >
                            Reset Password
                        </button>

                    </form>

                )}

                <div className="forgot-back-login">
                    <Link to="/login">
                        ← Back to Login
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;
