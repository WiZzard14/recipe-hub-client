"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6"
      >
        Discover & Share Your <span className="text-orange-500">Favorite Recipes</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-gray-600 max-w-2xl mb-10"
      >
        Join our community to explore thousands of delicious recipes, share your culinary creations, and get inspired by chefs around the world.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex gap-4"
      >
        <Link 
          href="/browse" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-orange-200"
        >
          Browse Recipes
        </Link>
        <Link 
          href="/register" 
          className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 px-8 py-3 rounded-full font-semibold text-lg transition-all"
        >
          Join Now
        </Link>
      </motion.div>
    </div>
  );
}