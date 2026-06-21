import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { validateEmail } from "../../utils/helper";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.FORGOT_PASSWORD,
        { email }
      );
      toast.success(response.data.message || "OTP code sent to your email.");
      // Redirect to reset password page and pass the email and otp state
      navigate("/reset-password", {
        state: {
          email,
          otp: response.data.otp,
        },
      });
    } catch (err) {
      console.error("Forgot password error", err);
      toast.error(err.response?.data?.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px] flex flex-col justify-center">
        <h3 className="text-3xl text-slate-900 dark:text-white font-bold tracking-tight">Forgot Password</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-7">
          Enter your registered email address to receive a password reset code.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "SENDING CODE..." : "SEND VERIFICATION CODE"}
          </button>
        </form>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 text-center">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
