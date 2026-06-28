import type { Metadata } from 'next';
import './globals.css';
import NavbarComponent from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';


export const metadata: Metadata = {
  title: 'RecipeHub | Recipe Sharing Platform',
  description: 'Create, share, discover, purchase and save recipes with RecipeHub.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-orange-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AuthProvider>
          <NavbarComponent />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
