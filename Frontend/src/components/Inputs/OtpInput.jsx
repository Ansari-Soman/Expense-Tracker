import React, { useRef } from "react";

const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([]);

  // Split value into array of 6 elements (fill with empty string)
  const otpArray = (value || "").split("").concat(Array(6).fill("")).slice(0, 6);

  const handleInput = (e, index) => {
    const val = e.target.value;
    const cleanVal = val.replace(/[^0-9]/g, ""); // strictly numbers
    const newOtpArray = [...otpArray];
    newOtpArray[index] = cleanVal ? cleanVal[cleanVal.length - 1] : ""; // take last digit

    const newOtp = newOtpArray.join("");
    onChange(newOtp);

    // Auto-focus next input if a digit was typed
    if (cleanVal && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpArray[index] && index > 0) {
        // Focus previous input if current is empty and backspace is clicked
        inputsRef.current[index - 1]?.focus();
        
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = "";
        onChange(newOtpArray.join(""));
      } else {
        const newOtpArray = [...otpArray];
        newOtpArray[index] = "";
        onChange(newOtpArray.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      const focusIndex = Math.min(pastedData.length, 5);
      inputsRef.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2.5 mb-6" onPaste={handlePaste}>
      {otpArray.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-lg font-semibold border border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-white rounded-lg focus:border-primary focus:outline-none transition-all duration-200"
        />
      ))}
    </div>
  );
};

export default OtpInput;
