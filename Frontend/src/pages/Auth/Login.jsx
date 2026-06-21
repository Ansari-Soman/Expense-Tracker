import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useState } from "react";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");
    setLoading(true);

    // Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("Login Error == ", err);
      if (
        err.response &&
        err.response.status === 403 &&
        err.response.data?.isVerified === false
      ) {
        toast.error("Email not verified. Redirecting to verification...");
        navigate("/verify-otp", {
          state: {
            email: err.response.data.email,
            otp: err.response.data.otp,
          },
        });
        return;
      }

      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px] flex flex-col justify-center">
        <h3 className="text-3xl text-slate-900 dark:text-white font-bold tracking-tight">Welcome Back</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-7">
          Please enter your details to log in to your account.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          <div className="flex justify-end -mt-2 mb-5">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary hover:text-purple-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-red-550 dark:text-red-400 text-xs pb-3 font-medium">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signUp" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
