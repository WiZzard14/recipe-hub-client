"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function NavbarComponent() {
  const { isLoggedIn, userImage, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-bold text-orange-500 text-2xl tracking-wide">
          RecipeHub
        </Link>

        <ul className="hidden sm:flex items-center gap-8">
          <li><Link href="/" className="font-medium hover:text-orange-500">Home</Link></li>
          <li><Link href="/browse" className="font-medium hover:text-orange-500">Browse Recipes</Link></li>
          {isLoggedIn && <li><Link href="/add-recipe" className="font-medium hover:text-orange-500">Add Recipe</Link></li>}
        </ul>

        <div className="flex items-center gap-5">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* Profile Image Dekhanor logic */}
              <img 
                src={userImage || "https://avatar.iran.liara.run/public"} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
              />
              <button onClick={handleLogout} className="text-red-500 font-bold hover:text-red-700">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden lg:block font-medium hover:text-orange-500">Login</Link>
              <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-medium transition-all">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
    </nav>
  );
}