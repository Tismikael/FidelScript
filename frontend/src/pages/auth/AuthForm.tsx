import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import style from "../../styles/auth.module.css";
// import GoogleLogo from "../../assets/google-icon.png";
import { useAuth } from "../../lib/context/auth/useAuth";
import type { CurrentUser } from "../../lib/context/auth/AuthContext";
import { API_BASE_URL } from "../../lib/api/api";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


type Mode = "login" | "signup";

interface AuthFormProps {
    mode: Mode;
}

interface FieldErrors {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}


export default function AuthForm({ mode }: AuthFormProps) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const isSignup = mode === "signup";

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const validate = (): FieldErrors => {
        const next: FieldErrors = {};
        if (!email.trim()) next.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";

        if (isSignup && !username.trim()) next.username = "Username is required";

        if (!password) next.password = "Password is required";
        else if (isSignup && password.length < 8) next.password = "Use at least 8 characters";

        if (isSignup && confirmPassword !== password) next.confirmPassword = "Passwords do not match";

        return next;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const nextErrors = validate();
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitError(null);
        const payload = isSignup ? { username, email, password } : { email, password };

        const url = `${API_BASE_URL}/v1/auth/${isSignup ? 'signup' : 'login'}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const body = await response.json();

            if (!response.ok) {
                const message = body?.data?.message ?? body?.error ?? `Server error: ${response.status}`;
                throw new Error(message);
            }

            const user: CurrentUser = body;
            login(user);
            navigate('/dashboard');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
        }
    };

    // const handleGoogle = () => {
    //     console.log("Google SSO clicked");
    // };

    return (
        <div className={style.container}>
            <div className={style.panel}>
                <h1 className={style.title}>{isSignup ? "Create an account" : "Welcome back"}</h1>
                {submitError && <p className={style.error_text}>{submitError}</p>}

                <form className={style.form} onSubmit={handleSubmit} noValidate>
                    <div className={style.field}>
                        <label className={style.label} htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className={`${style.input} ${errors.email ? style.input_error : ""}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className={style.error_text}>{errors.email}</p>}
                    </div>

                    {isSignup && (
                        <div className={style.field}>
                            <label className={style.label} htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                className={`${style.input} ${errors.username ? style.input_error : ""}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && <p className={style.error_text}>{errors.username}</p>}
                        </div>
                    )}

                    <div className={style.field}>
                        <label className={style.label} htmlFor="password">Password</label>
                        <div className={style.password_wrapper}>
                            <input
                                id="password"
                                type={visible ? "text" : "password"}
                                autoComplete={isSignup ? "new-password" : "current-password"}
                                className={`${style.input} ${style.input_password} ${errors.password ? style.input_error : ""}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className={style.password_toggle}
                                onClick={() => setVisible((v) => !v)}
                                tabIndex={-1}
                                aria-label={visible ? "Hide password" : "Show password"}
                            >
                                {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </button>
                        </div>
                        {errors.password && <p className={style.error_text}>{errors.password}</p>}
                    </div>

                    {isSignup && (
                        <div className={style.field}>
                            <label className={style.label} htmlFor="confirmPassword">Verify Password</label>
                            <div className={style.password_wrapper}>
                                <input
                                    id="confirmPassword"
                                    type={confirmVisible ? "text" : "password"}
                                    autoComplete="new-password"
                                    className={`${style.input} ${style.input_password} ${errors.confirmPassword ? style.input_error : ""}`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className={style.password_toggle}
                                    onClick={() => setConfirmVisible((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={confirmVisible ? "Hide password" : "Show password"}
                                >
                                    {confirmVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className={style.error_text}>{errors.confirmPassword}</p>}
                        </div>
                    )}

                    <button type="submit" className={style.submit_button}>
                        {isSignup ? "Sign Up" : "Log In"}
                    </button>
                </form>
{/* 
                <div className={style.divider}>
                    <span className={style.divider_line} />
                    or
                    <span className={style.divider_line} />
                </div>

                <button type="button" className={style.google_button} onClick={handleGoogle}>
                    <img src={GoogleLogo} alt="google logo"/>
                    Sign {isSignup ? "up" : "in"} with Google
                </button> */}

                <p className={style.switch_text}>
                    {isSignup ? (
                        <>Already have an account? <button type="button" className={style.switch_link} onClick={() => navigate("/login")}>Log in</button></>
                    ) : (
                        <>Don't have an account? <button type="button" className={style.switch_link} onClick={() => navigate("/signup")}>Sign up</button></>
                    )}
                </p>
            </div>
        </div>
    );
}
