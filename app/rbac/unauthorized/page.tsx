import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Access Denied
        </h1>

        <p className="mt-3 text-gray-600">
          You do not have permission to
          access this page.
        </p>

        <Link
          href="/"
          className="inline-block mt-6 px-5 py-3 rounded bg-black text-white"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}