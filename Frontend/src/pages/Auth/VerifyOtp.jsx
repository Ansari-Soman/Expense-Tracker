import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import OtpInput from "../../components/Inputs/OtpInput";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/UserContext";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const initialEmail = location.state?.email || "";
  const initialOtp = location.state?.otp || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [receivedOtp, setReceivedOtp] = useState(initialOtp);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (otp.length !== 6 || isNaN(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        toast.success("Account verified successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Verification error", err);
      toast.error(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please provide your email address first.");
      return;
    }

    setResending(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email });
      if (response.data?.otp) {
        setReceivedOtp(response.data.otp);
      }
      toast.success("Verification code resent successfully!");
    } catch (err) {
      console.error("Resend OTP error", err);
      toast.error(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  const handleAutofill = () => {
    setOtp(receivedOtp);
    toast.success("OTP autofilled!");
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[420px] flex flex-col justify-center">
        <h3 className="text-3xl text-slate-900 dark:text-white font-bold tracking-tight">Verify Your Account</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-7">
          Please enter the 6-digit verification code sent to your email.
        </p>

        {receivedOtp && (
          <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm shadow-purple-500/5">
            <div className="text-center md:text-left">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider block mb-0.5">⚙️ Developer Mode</span>
              <p className="text-sm text-purple-900 dark:text-purple-200">
                Mock verification code: <span className="font-mono font-bold text-base text-primary">{receivedOtp}</span>
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

        <form onSubmit={handleVerify}>
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
            <label className="text-[13px] text-slate-800 dark:text-slate-200 font-medium">Verification Code (OTP)</label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "VERIFYING..." : "VERIFY CODE"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm">
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-primary font-semibold hover:text-purple-600 cursor-pointer bg-transparent border-none transition-all duration-200"
          >
            {resending ? "Resending..." : "Resend Verification Code"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:underline cursor-pointer bg-transparent border-none transition-all duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
