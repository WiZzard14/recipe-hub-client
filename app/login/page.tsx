"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/firebase/firebase.config";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      alert("Login successful!");
      router.push("/"); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google Login failed in backend");

      alert("Google Login successful!");
      router.push("/"); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred during Google Login");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-orange-500" />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="w-full p-3 border rounded-lg focus:outline-orange-500" />
          
          <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition">
            Login
          </button>
        </form>

        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="text-center text-sm font-semibold mx-4 mb-0 text-gray-500">OR</p>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          type="button"
          className="w-full bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account? <Link href="/register" className="text-orange-500 font-bold hover:underline">Register here</Link>

        </p>
      </div>
    </div>
  );
}