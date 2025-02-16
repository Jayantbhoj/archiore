"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import { sendOtpAction, verifyOtpAction, signupAction } from "@/app/actions";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function SignupComponent() {
  const [step, setStep] = useState<"email" | "otp" | "signup">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!email.includes("@")) {
      setErrors({ email: "Please enter a valid email." });
      return;
    }

    startTransition(async () => {
      try {
        const result = await sendOtpAction(email);
        if (result.ok) {
          setSuccessMessage("OTP sent to your email. (Check spam if not received)");
          setStep("otp");
          setFormData(prev => ({ ...prev, email }));
        } else {
          setErrors({ form: result.message || "Failed to send OTP. Try again." });
        }
      } catch {
        setErrors({ form: "An error occurred. Please try again later." });
      }
    });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (otp.length !== 6) {
      setErrors({ form: "OTP must be 6 digits." });
      return;
    }

    startTransition(async () => {
      try {
        const result = await verifyOtpAction(email, otp);
        if (result.ok) {
          setSuccessMessage("Email verified successfully!");
          setStep("signup");
        } else {
          setErrors({ form: "Invalid OTP. Try again." });
        }
      } catch {
        setErrors({ form: "An error occurred. Please try again later." });
      }
    });
  };

  const validateSignupForm = (): boolean => {
    let valid = true;
    const newErrors: FormErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }
    if (!formData.username) {
      newErrors.username = "Username is required.";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (validateSignupForm()) {
      startTransition(async () => {
        try {
          const result = await signupAction(formData);
          if (result.ok) {
            setSuccessMessage("Account created successfully!");
            router.push("/home");
          } else {
            setErrors(prev => ({ ...prev, form: result.error || "Signup failed. Please try again." }));
          }
        } catch {
          setErrors(prev => ({ ...prev, form: "An error occurred. Please try again later." }));
        }
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 relative">
        <img src="/banner.jpg" alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 text-center text-white px-4 py-8 w-full h-full flex justify-center items-center">
          <div>
            <img
              src="logo.png"
              alt="Logo"
              className="absolute top-4 left-4 cursor-pointer"
              style={{ width: "100px", height: "35px" }}
              onClick={() => (window.location.href = "/")}
            />
            <h2 className="text-4xl text-myBlack font-semibold mb-4">Design. Share. Inspire.</h2>
            <p className="text-xl text-myBlack">Connecting Architects of Tomorrow.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex justify-center items-center">
        <div className="w-full max-w-md p-8 space-y-6">
          <h2 className="text-2xl font-bold text-myBlack text-center">
            {step === "email" ? "Sign Up to Archiore" : step === "otp" ? "Verify Email" : "Complete Sign Up"}
          </h2>
          
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          {errors.form && <p className="text-red-500 text-center">{errors.form}</p>}

          {step === "email" && (
            <form className="space-y-4" onSubmit={handleSendOtp}>
              <LabelledInput
                label="Email"
                name="email"
                placeholder="abc@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
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

          {step === "signup" && (
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="flex gap-4">
                <LabelledInput
                  label="First Name"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <LabelledInput
                  label="Last Name"
                  name="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>
              <LabelledInput
                label="Username"
                name="username"
                placeholder="johnsmith24"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
              />
              <LabelledInput
                label="Password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <LabelledInput
                label="Confirm Password"
                name="confirmPassword"
                placeholder="••••••••"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <button
                type="submit"
                className="w-full bg-myRed text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors hover:bg-myRed-dark focus:outline-none focus:ring-4 focus:ring-myRed-light"
                disabled={isPending}
              >
                {isPending ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

interface LabelledInputProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function LabelledInput({ label, name, placeholder, type = "text", value, onChange, error }: LabelledInputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-2.5 text-sm bg-gray-50 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}