import { BookOpen } from "lucide-react";
import styles from "./ForgetPassword.module.scss";
import { CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../../hooks/useApi";
import SnackBar from "../../components/common/Snackbar/Snackbar";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { request, loading } = useAPI();

  const [email, setEmail] = useState("");

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    messsage: "",
    severity: "error",
  });

  const handleCloseSnackBar = () => {
    setSnackbarData((prev) => {
      return {
        ...prev,
        open: false,
      };
    });
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const goToSignUp = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await request({
        method: "POST",
        url: `/api/User/ForgotPassword?email=${email}`,
        data: null,
        headers: {},
      });
      setSnackbarData({
        open: true,
        messsage: response.message,
        severity: "success",
      });
    } catch (error) {
      setSnackbarData({
        open: true,
        messsage: error.response?.data?.message || "Internal Server Error",
        severity: "error",
      });
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <BookOpen size={40} />
            <p>Bookstore</p>
          </div>
        </div>
      </header>
      <h1 className={styles.title}>forgot your password?</h1>
      <section className={styles.forgetPasswordBox}>
        <p className={styles.description}>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            label="Email"
            type="email"
            value={email}
            onChange={handleChange}
            name="email"
            className={styles.emailField}
          />
          <button className={styles.resetPasswordButton} disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : "Reset Password"}
          </button>
        </form>
        <div className={styles.createAccountLink} onClick={goToSignUp}>
          <h1>create account</h1>
        </div>
      </section>
      {/* Material ui snackbar for custom notifications */}
      <SnackBar
        open={snackbarData.open}
        onClose={handleCloseSnackBar}
        severity={snackbarData.severity}
        message={snackbarData.messsage}
      />
    </>
  );
};

export default ForgetPassword;
