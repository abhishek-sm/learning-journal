import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-32 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
      >
        Back home
      </Link>
    </div>
  );
}
