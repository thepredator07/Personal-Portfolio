import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 font-mono">
      <p className="text-xs text-fail">HTTP 404</p>
      <h1 className="mt-3 text-2xl text-fg">This route has no healthy upstream.</h1>
      <p className="mt-3 text-sm text-muted">The page you asked for doesn&apos;t exist — or was never deployed.</p>
      <p className="mt-8 text-sm">
        <Link href="/" className="text-accent hover:underline">
          ← failover to home
        </Link>
      </p>
    </div>
  );
}
