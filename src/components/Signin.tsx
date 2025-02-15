"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions";

export default function SignInComponent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "", form: "" });
  const [isPending, startTransition] = useTransition(); // To show loading state
  const router = useRouter();

  const validateForm = () => {
    let valid = true;
    let newErrors = { email: "", password: "", form: "" };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "", form: "" });

    if (validateForm()) {
      startTransition(async () => {
        try {
          const result = await loginAction(formData);

          if (result.ok) {
            // Redirect to /home on successful login
            router.push("/home");
          } else {
            setErrors((prev) => ({
              ...prev,
              form: result.message || "Invalid email or password.",
            }));
          }
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            form: "An error occurred. Please try again later.",
          }));
        }
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side (Image as Background with Heading and Logo) */}
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

      {/* Right Side (Sign In Form) */}
      <div className="w-full lg:w-1/2 bg-white flex justify-center items-center">
        <div className="w-full max-w-md p-8 space-y-6">
          <h2 className="text-2xl font-bold text-myBlack text-center">
            Log In
          </h2>

          {/* Error Message */}
          {errors.form && (
            <p className="text-red-500 text-center">{errors.form}</p>
          )}

          {/* Sign In Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="abc@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2.5 text-sm bg-gray-50 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-2.5 text-sm bg-gray-50 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-myRed text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4 transition-colors hover:bg-myRed-dark focus:outline-none focus:ring-4 focus:ring-myRed-light"
              disabled={isPending}
            >
              {isPending ? "Logging In..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
