"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();
  const { login } = useAuth(); // Notun login function anlaam

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Jodi backend image na dey, tahole dummy avatar bebohar korbo
        const userImg = data.user?.image || "https://avatar.iran.liara.run/public";
        
        login(userImg); // Context update kore image save kora
        
        alert("Login Successful!");
        router.push("/add-recipe");
      } else {
        alert("Login Failed: " + (data.message || "Invalid Credentials"));
      }
    } catch (error) {
      alert("Network Error!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-2xl border">
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">Login to RecipeHub</h2>
      
      <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-4">
        <input type="email" placeholder="Email Address" required className="p-3 border rounded-lg focus:outline-orange-500" onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Password" required className="p-3 border rounded-lg focus:outline-orange-500" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit" className="bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600">Login</button>
      </form>

      <div className="relative flex items-center justify-center w-full mt-6 border border-t">
        <div className="absolute px-5 bg-white">Or</div>
      </div>

      {/* Google Login Button (UI) */}
      <button type="button" className="w-full mt-6 flex items-center justify-center gap-3 p-3 border rounded-lg font-medium hover:bg-gray-50 transition-all">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
        Continue with Google
      </button>
    </div>
  );
}