import Link from "next/link"; // Import Link from next/link

export default function Navbar() {
  return (
    <header className="w-full px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Ask Cricket</h1>
        <nav>
          <Link href="/About" className="text-zinc-900 dark:text-white hover:text-gray-500">
            About Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
