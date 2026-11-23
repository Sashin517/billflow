import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthGoldRibbon from "@/public/images/auth-gold-ribbon.svg";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <main className="bg-center bg-no-repeat bg-cover relative min-h-screen h-full-screen w-full overflow-hidden select-none text-white flex flex-col items-center justify-center px-4 py-12"
        style={{
          backgroundImage: `url(${AuthGoldRibbon.src ?? AuthGoldRibbon})`,
        }}>
        {/* Foreground centered form container */}
        <div className="relative z-10 w-full max-w-[360px]">{children}</div>
      </main>
    </GoogleOAuthProvider>
  );
}