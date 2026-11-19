import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
      <h2 className="text-3xl font-bold text-primary mb-4">404 - Not Found</h2>
      <p className="mb-6 text-muted-foreground">Could not find requested resource</p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  );
}