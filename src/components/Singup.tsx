"use client"
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signupAction } from "@/app/actions";

export default function SignupComponent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<
      Record<"firstName" | "lastName" | "email" | "username" | "password" | "confirmPassword", string>
    > & { form?: string }
  >({});

  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Name validation (split into first name and last name)
    if (!formData.firstName) {
      newErrors.firstName = "First name is required.";
      valid = false;
    } else {
      newErrors.firstName = "";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    } else {
      newErrors.lastName = "";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
      valid = false;
    } else {
      newErrors.email = "";
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required.";
      valid = false;
    } else {
      newErrors.username = "";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    } else {
      newErrors.password = "";
    }

    // Confirm Password validation
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    } else {
      newErrors.confirmPassword = "";
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

    // Reset form-specific error messages and success message before validation
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      form: "", // Reset the form error as well
    });
    setSuccessMessage(""); // Clear any success message

    // Validate the form inputs
    if (validateForm()) {
      startTransition(async () => {
        try {
          // Call the signup action
          const result = await signupAction(formData);

          if (result.ok) {
            setSuccessMessage("Account created successfully!");
            router.push("/home"); // Redirect to /home on success
          } else {
            // Handle the error message in case of failure
            setErrors((prev) => ({
              ...prev,
              form: result.error || "Signup failed. Please try again.",
            }));
          }
        } catch (error: any) {
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
      {/* Left Side */}
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

      {/* Right Side */}
      <div className="w-full lg:w-1/2 bg-white flex justify-center items-center">
        <div className="w-full max-w-md p-8 space-y-6">
          <h2 className="text-2xl font-bold text-myBlack text-center">
            Sign Up to Archiore
          </h2>

          {successMessage && (
            <p className="text-green-500 text-center">{successMessage}</p>
          )}
          {errors.form && (
            <p className="text-red-500 text-center">{errors.form}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              label="Email"
              name="email"
              placeholder="abc@gmail.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
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
              className="w-full bg-myRed text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4 transition-colors hover:bg-myRed-dark focus:outline-none focus:ring-4 focus:ring-myRed-light"
              disabled={isPending}
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
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

function LabelledInput({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
}: LabelledInputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
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
