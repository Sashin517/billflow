import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthGoldRibbon from "@/public/images/auth-gold-ribbon.svg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <main className="bg-center bg-no-repeat bg-cover relative min-h-screen h-full-screen w-full overflow-hidden select-none text-white flex flex-col items-center justify-center px-4 py-12"
        style={{
          backgroundImage: `url(${AuthGoldRibbon.src ?? AuthGoldRibbon})`,
        }}>
        {/* Bottom sweeping 3D metallic gold wave */}
        {/* <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[42vh] min-h-[260px] bg-bottom bg-no-repeat bg-cover select-none"
          style={{
            backgroundImage: "url('/images/auth-gold-ribbon.svg')",
          }}
        /> */}

        {/* Foreground centered form container */}
        <div className="relative z-10 w-full max-w-[360px]">{children}</div>
      </main>
    </GoogleOAuthProvider>
  );
}