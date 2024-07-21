import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { UserExercisesProvider } from "@/context/UserExercisesContext";
import Header from '@/components/molecules/Header';
import AuthButton from '@/components/atoms/AuthButton';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <UserProvider>
          <UserExercisesProvider>
            <div className="min-h-screen flex flex-col">
              <Header>
                <AuthButton />
              </Header>
              <main className="flex-grow flex flex-col items-center">
                {children}
              </main>
            </div>
          </UserExercisesProvider>
        </UserProvider>
      </body>
    </html>
  );
}