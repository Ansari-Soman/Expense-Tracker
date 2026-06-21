import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import OtpInput from "../../components/Inputs/OtpInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || "";
  const initialOtp = location.state?.otp || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [receivedOtp, setReceivedOtp] = useState(initialOtp);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    if (otp.length !== 6 || isNaN(otp)) {
      toast.error("Please enter a valid 6-digit OTP code.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        email,
        otp,
        newPassword,
      });
      toast.success(response.data.message || "Password reset successful!");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error", err);
      toast.error(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = () => {
    setOtp(receivedOtp);
    toast.success("OTP autofilled!");
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px] flex flex-col justify-center">
        <h3 className="text-3xl text-slate-900 dark:text-white font-bold tracking-tight">Reset Password</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-7">
          Enter the verification code sent to your email along with your new password.
        </p>

        {receivedOtp && (
          <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm shadow-purple-500/5">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider block mb-0.5">⚙️ Developer Mode</span>
              <p className="text-sm text-purple-900 dark:text-purple-200">
                Mock reset code: <span className="font-mono font-bold text-base text-primary">{receivedOtp}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="text-xs font-semibold text-white bg-primary hover:bg-opacity-90 px-3.5 py-2 rounded-lg shadow-sm transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Autofill Code
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!initialEmail && (
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />
          )}

          <div className="mb-2">
            <label className="text-[13px] text-slate-800 dark:text-slate-200 font-medium">Reset Verification Code (OTP)</label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          <Input
            value={newPassword}
            onChange={({ target }) => setNewPassword(target.value)}
            label="New Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          <Input
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
          />

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "RESETTING..." : "RESET PASSWORD"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:text-purple-600 dark:hover:text-purple-400 hover:underline bg-transparent border-none cursor-pointer transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
