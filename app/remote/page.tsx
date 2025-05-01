"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Download } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// This is a client-side mock for the demo
// In a real app, you'd use a server action or API route
const mockFetchRemoteMarkdown = async (url: string) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Basic URL validation
  try {
    new URL(url)
  } catch (err) {
    return { success: false, error: "Please enter a valid URL" }
  }

  // Simulate successful fetch
  return { success: true, filename: `remote-content-${Date.now()}.md` }
}

export default function RemotePage() {
  const { t } = useLanguage()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await mockFetchRemoteMarkdown(url)

      if (result.success) {
        setSuccess(true)
        // Reset form after successful fetch
        setUrl("")
      } else {
        setError(result.error || "Failed to fetch markdown content")
      }
    } catch (err) {
      setError("An error occurred while fetching the content")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        {t("back.to.all.files")}
      </Link>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t("fetch.remote.markdown")}</h1>

        {success ? (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-green-700">{t("content.fetched")}</p>
            <Link
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              {t("view.all.files")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                {t("remote.markdown.url")}
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/file.md"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">{t("enter.url")}</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !url}
              className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? t("fetching") : t("fetch.and.save")}
              {!isLoading && <Download className="inline-block ml-2 h-4 w-4" />}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
