"use client";
import { useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  onSubmit: (otp: string) => void;
  onCancel: () => void;
  reSendOTP: () => void;
}

const OTPInput = ({ length = 4, onSubmit, onCancel, reSendOTP }: OTPInputProps) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (otpValues.every((digit) => digit !== "")) {
      onSubmit(otpValues.join(""));
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-4">
      <div className="d-flex gap-2 justify-content-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el!;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otpValues[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="form-control text-center fw-bold fs-4"
            style={{ width: "3rem", height: "3rem" }}
          />
        ))}
      </div>
      <p className="cursor-pointer" onClick={reSendOTP}>Resend OTP</p>
      <div className=" d-flex gap-2.5">
        <button
          onClick={handleSubmit}
          className="btn btn-primary m-2 px-4"
        >
          Verify OTP
        </button>
        <button
          onClick={onCancel}
          className="btn btn-danger m-2 px-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPInput;
