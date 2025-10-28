export const validateForm = (
  email: string,
  password: string,
  confirmPassword?: string
) => {
  const newErrors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    newErrors.email = "Invalid email format";
  }

  const trimmedPassword = password.trim();

  if (!trimmedPassword) {
    newErrors.password = "Password is required";
  } else if (trimmedPassword.length < 8) {
    newErrors.password = `Password must be at least 8 characters`;
  } else if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d|[@$!%*?&])/.test(trimmedPassword)
  ) {
    newErrors.password =
      "Password must include uppercase, lowercase, and number/symbol";
  }

  if (confirmPassword !== undefined) {
    const trimmedConfirm = confirmPassword.trim();
    if (!trimmedConfirm) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (trimmedConfirm !== trimmedPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
  }

  return newErrors;
};
