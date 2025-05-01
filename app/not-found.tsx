import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">File Not Found</h2>
      <p className="text-gray-600 mb-8">The markdown file you're looking for doesn't exist.</p>
      <Link href="/" className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
        Return Home
      </Link>
    </div>
  )
}
