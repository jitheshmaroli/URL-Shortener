import React, { useState } from "react";
import { register } from "../services/api";
import styles from "../styles/Register.module.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";
import { validateForm } from "../utils/validation";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(email, password, confirmPassword);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const res = await register(email, password);
    setMessage(
      res.success
        ? "Registered! Redirecting to login..."
        : res.message ?? "Registration failed"
    );
    if (res.success) setTimeout(() => navigate(ROUTES.LOGIN), 1500);
  };

  return (
    <div className={styles.card}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email-register"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            className={styles.input}
            autoComplete="new-email"
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password-register"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className={styles.input}
            autoComplete="new-password"
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword-register"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
            className={styles.input}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>
        <button type="submit" className={styles.button}>
          Register
        </button>
        <p
          className={
            message.includes("failed") ? styles.error : styles.success
          }>
          {message}
        </p>
      </form>
      <p className={styles.link}>
        Already have an account? <a href={ROUTES.LOGIN}>Login</a>
      </p>
    </div>
  );
};

export default Register;
