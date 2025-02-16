"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "react-otp-input";
import { verifyOtpAction } from "@/app/actions";



export default function Verify(email:string) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query params
  const [isPending, startTransition] = useTransition();



  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    if (!email) {
      setError("Missing email. Please retry.");
      return;
    }

    startTransition(async () => {
      const result = await verifyOtpAction(email, otp);
      if (result.ok) {
        setSuccessMessage("OTP verified successfully!");
        router.push("/home");
      } else {
        setError(result.message || "Invalid OTP. Try again.");
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
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

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6">
          <h2 className="text-2xl font-bold text-myBlack text-center">
            Enter OTP
          </h2>

          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <div className="text-center text-gray-500">Email: {email || "Not provided"}</div>
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
              className="w-full bg-myRed text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4 transition-colors hover:bg-myRed-dark focus:outline-none focus:ring-4 focus:ring-myRed-light"
              disabled={isPending}
            >
              {isPending ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
