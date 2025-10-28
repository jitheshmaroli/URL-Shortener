import React, { useState } from "react";
import { login } from "../services/api";
import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";
import { validateForm } from "../utils/validation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const newErrors = validateForm(email, password);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      const res = await login(email, password);
      console.log(res);

      if (res.success) {
        setMessage("Logged in successfully!");
        setTimeout(() => navigate(ROUTES.SHORTEN), 1500);
      } else {
        const errorMsg = res.message || "Login failed. Please try again.";
        setMessage(
          errorMsg.includes("Invalid") ? "Invalid email or password." : errorMsg
        );
      }
    } catch {
      setMessage(
        "Login failed due to a network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email-login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            className={styles.input}
            autoComplete="new-email"
            disabled={isLoading}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password-login"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className={styles.input}
            autoComplete="new-password"
            disabled={isLoading}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {message && (
          <p
            className={
              message.toLowerCase().includes("invalid") ||
              message.toLowerCase().includes("failed") ||
              message.toLowerCase().includes("error")
                ? styles.error
                : styles.success
            }>
            {message}
          </p>
        )}
      </form>
      <p className={styles.link}>
        Don't have an account? <a href={ROUTES.REGISTER}>Register</a>
      </p>
    </div>
  );
};

export default Login;
