"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import { sendOtpAction, verifyOtpAction, changePasswordAction } from "../actions";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    startTransition(async () => {
      const result = await sendOtpAction(email);
      if (result.ok) {
        setSuccessMessage("OTP sent to your email.");
        setStep("otp");
      } else {
        setError(result.message || "Failed to send OTP. Try again.");
      }
    });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    startTransition(async () => {
      const result = await verifyOtpAction(email, otp);
      if (result.ok) {
        setSuccessMessage("OTP verified! Enter new password.");
        setStep("password");
      } else {
        setError("Invalid OTP. Try again.");
      }
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    startTransition(async () => {
      const result = await changePasswordAction(email, newPassword);
      if (result.ok) {
        setSuccessMessage("Password changed successfully! Redirecting...");
        setTimeout(() => router.push("/signin"), 2000);
      } else {
        setError(result.message || "Failed to change password. Try again.");
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left-side image (Only for large screens) */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src="/banner.jpg"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center text-white px-4 py-8 w-full h-full flex justify-center items-center">
          <div>
            <img
              src="logo.png"
              alt="Logo"
              className="absolute top-4 left-4 cursor-pointer"
              style={{ width: "100px", height: "35px" }}
              onClick={() => (window.location.href = "/")}
            />
            <h2 className="text-4xl text-myBlack font-semibold mb-4">
            Design. Share. Inspire.
            </h2>
            <p className="text-xl text-myBlack">
            Connecting Architects of Tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* Right-side form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6">
          <h2 className="text-2xl font-bold text-myBlack text-center">
            {step === "email" ? "Forgot Password" : step === "otp" ? "Enter OTP" : "Set New Password"}
          </h2>

          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {step === "email" && (
            <form className="space-y-4" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-myRed text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors hover:bg-myRed-dark focus:outline-none focus:ring-4 focus:ring-myRed-light"
                disabled={isPending}
              >
                {isPending ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div className="text-center text-gray-500">{email}</div>
              <div className="flex justify-center">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span className="px-2">-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="w-12 h-12 text-2xl text-center border-1 border-gray-400 rounded-lg focus:ring-black bg-white text-black outline-none"
                      style={{ caretColor: "black" }}
                    />
                  )}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-myRed text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors hover:bg-myRed-dark focus:outline-none focus:ring-4 focus:ring-myRed-light"
                disabled={isPending}
              >
                {isPending ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {step === "password" && (
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div className="text-center text-gray-500">{email}</div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-myRed text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors hover:bg-myRed-dark focus:outline-none focus:ring-4 focus:ring-myRed-light"
                disabled={isPending}
              >
                {isPending ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
