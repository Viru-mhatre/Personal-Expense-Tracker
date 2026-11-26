
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { registerUser } from "../services/AuthService";
// import { Eye, EyeOff } from "lucide-react";
// import Swal from "sweetalert2";

// function Register() {

//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: ""
//     });

//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     // Handle input changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle Registration
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const trimmedName = formData.name.trim();
//         const trimmedEmail = formData.email.trim();
//         const password = formData.password;
//         const confirmPassword = formData.confirmPassword;

//         // Empty field validation
//         if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
//             await Swal.fire({
//                 icon: "warning",
//                 title: "All Fields Required!",
//                 text: "Please fill in all fields before registering.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         // Full Name validation
//         const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

//         if (trimmedName.length < 2 || !nameRegex.test(trimmedName)) {
//             await Swal.fire({
//                 icon: "error",
//                 title: "Invalid Full Name!",
//                 text: "Enter a valid name using letters, spaces, hyphens or apostrophes.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(trimmedEmail)) {
//             await Swal.fire({
//                 icon: "error",
//                 title: "Invalid Email!",
//                 text: "Please enter a valid email address.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         // Password length validation
//         if (password.length < 8) {
//             await Swal.fire({
//                 icon: "error",
//                 title: "Weak Password!",
//                 text: "Password must contain at least 8 characters.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         // Uppercase validation
//         if (!/[A-Z]/.test(password)) {
//             await Swal.fire({
//                 icon: "error",
//                 title: "Weak Password!",
//                 text: "Password must contain at least one uppercase letter.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         // Lowercase validation
//         if (!/[a-z]/.test(password)) {
//             await Swal.fire({
//                 icon: "error",
//                 title: "Weak Password!",
//                 text: "Password must contain at least one lowercase letter.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         // Number validation
//         if (!/[0-9]/.test(password)) {
//             await Swal.fire({
//                 icon: "error",
//                 title: "Weak Password!",
//                 text: "Password must contain at least one number.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         // Special character validation
//         if (!/[^A-Za-z0-9]/.test(password)) {
//             await Swal.fire({
//                 icon: "error",
//                 title: "Weak Password!",
//                 text: "Password must contain at least one special character.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         // Confirm Password validation
//         if (password !== confirmPassword) {
//             await Swal.fire({
//                 icon: "error",
//                 title: "Password Mismatch!",
//                 text: "Password and Confirm Password must match.",
//                 confirmButtonColor: "#4f46e5"
//             });
//             return;
//         }

//         setLoading(true);

//         try {

//             // Send only backend-required fields
//             await registerUser({
//                 name: trimmedName,
//                 email: trimmedEmail,
//                 password: password
//             });

//             await Swal.fire({
//                 icon: "success",
//                 title: "Registration Successful!",
//                 text: "Your account has been created successfully. Please login to continue.",
//                 confirmButtonText: "Go to Login",
//                 confirmButtonColor: "#4f46e5"
//             });

//             sessionStorage.removeItem("hasVisitedLogin");
//             navigate("/login");

//         } catch (err) {

//             Swal.fire({
//                 icon: "error",
//                 title: "Registration Failed!",
//                 text:
//                     err.response?.data?.message ||
//                     "Something went wrong. Please try again.",
//                 confirmButtonColor: "#4f46e5"
//             });

//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="auth-container">

//             <div className="auth-card">

//                 <h1>Create Account</h1>

//                 <p>Start managing your money today</p>

//                 <form onSubmit={handleSubmit} noValidate>

//                     {/* Full Name */}
//                     <label>Full Name</label>

//                     <input
//                         type="text"
//                         name="name"
//                         placeholder="Enter your full name"
//                         value={formData.name}
//                         onChange={handleChange}
//                     />

//                     {/* Email Address */}
//                     <label>Email Address</label>

//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="Enter your email"
//                         value={formData.email}
//                         onChange={handleChange}
//                     />

//                     {/* Password */}
//                     <label>Password</label>

//                     <div className="password-field">

//                         <input
//                             type={showPassword ? "text" : "password"}
//                             name="password"
//                             placeholder="Minimum 8 characters"
//                             value={formData.password}
//                             onChange={handleChange}
//                         />

//                         <button
//                             type="button"
//                             className="toggle-password"
//                             onClick={() => setShowPassword(!showPassword)}
//                             aria-label={
//                                 showPassword
//                                     ? "Hide password"
//                                     : "Show password"
//                             }
//                         >
//                             {showPassword ? (
//                                 <EyeOff size={20} />
//                             ) : (
//                                 <Eye size={20} />
//                             )}
//                         </button>

//                     </div>

//                     {/* Confirm Password */}
//                     <label>Confirm Password</label>

//                     <div className="password-field">

//                         <input
//                             type={showPassword ? "text" : "password"}
//                             name="confirmPassword"
//                             placeholder="Confirm your password"
//                             value={formData.confirmPassword}
//                             onChange={handleChange}
//                         />

//                         <button
//                             type="button"
//                             className="toggle-password"
//                             onClick={() => setShowPassword(!showPassword)}
//                             aria-label={
//                                 showPassword
//                                     ? "Hide password"
//                                     : "Show password"
//                             }
//                         >
//                             {showPassword ? (
//                                 <EyeOff size={20} />
//                             ) : (
//                                 <Eye size={20} />
//                             )}
//                         </button>

//                     </div>

//                     {/* Register Button */}
//                     <button
//                         type="submit"
//                         disabled={loading}
//                     >
//                         {loading
//                             ? "Creating Account..."
//                             : "Register"}
//                     </button>

//                 </form>

//                 {/* Login Link */}
//                 <p className="auth-link">
//                     Already have an account?
//                     <Link to="/login"> Login</Link>
//                 </p>

//             </div>

//         </div>
//     );
// }

// export default Register;



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
                                placeholder="Reenter your password"
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
