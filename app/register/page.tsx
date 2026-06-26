"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/firebase/firebase.config"; // @ dile direct root theke path pabe

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });
  const [error, setError] = useState("");
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please login.");
      router.push("/login"); // Register korar por Login page-e pathano hocche
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during registration");
      }
    }
  };

  // Google Registration/Login
  const handleGoogleLogin = async () => {
    setError("");
    try {
      // 1. Firebase theke Google Popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. User er data backend e pathano (Google login route call kora hocche)
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Cookie save korar jonno
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google Auth failed in backend");

      alert("Successfully authenticated with Google!");
      router.push("/dashboard"); // Google auth-e sora-sori log in hoye jay, tai Dashboard-e pathano hocche
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during Google Auth");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            required 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-orange-500" 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            required 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-orange-500" 
          />
          <input 
            type="text" 
            name="image" 
            placeholder="Image URL (Optional)" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-orange-500" 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password (Min 6 chars, 1 Upper, 1 Lower)" 
            required 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-orange-500" 
          />
          
          <button 
            type="submit" 
            className="w-full bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="text-center text-sm font-semibold mx-4 mb-0 text-gray-500">OR</p>
        </div>

        {/* Google Registration Button */}
        <button 
          onClick={handleGoogleLogin} 
          type="button"
          className="w-full bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          {/* Google SVG Icon */}
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          </svg>
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-orange-500 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}