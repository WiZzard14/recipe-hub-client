"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NavbarComponent() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="font-bold text-orange-500 text-2xl tracking-wide">
            RecipeHub
          </Link>
        </motion.div>

        <ul className="hidden sm:flex items-center gap-8">
          <li>
            <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/browse" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Browse Recipes
            </Link>
          </li>
        </ul>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex items-center gap-5"
        >
          <Link href="/login" className="hidden lg:block text-gray-700 hover:text-orange-500 font-medium transition-colors">
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Register
          </Link>
        </motion.div>
        
      </header>
    </nav>
  );
}