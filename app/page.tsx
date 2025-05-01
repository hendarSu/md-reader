"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Upload, Globe, FileDown, FileIcon as FileWord } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const { t } = useLanguage()
  const [fileNames, setFileNames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch file names from an API route instead of using fs directly
  useEffect(() => {
    async function fetchFiles() {
      try {
        // In a real app, this would be an API call to a server endpoint
        // For now, we'll use a mock response
        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock file list - in a real app, this would come from an API
        setFileNames(["example.md", "javascript-examples.md", "code-example.md"])
      } catch (error) {
        console.error("Error fetching files:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">{t("app.title")}</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/upload"
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            {t("upload.file")}
          </Link>
          <Link
            href="/remote"
            className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <Globe className="h-4 w-4 mr-2" />
            {t("fetch.remote")}
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-gray-500">Loading files...</div>
        </div>
      ) : fileNames.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">{t("no.files.found")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/upload"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t("upload.file")}
            </Link>
            <Link
              href="/remote"
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <Globe className="h-4 w-4 mr-2" />
              {t("fetch.remote")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fileNames.map((fileName) => (
            <Link
              key={fileName}
              href={`/posts/${fileName.replace(/\.md$/, "")}`}
              className="block p-6 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {fileName.replace(/\.md$/, "").replace(/-/g, " ")}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">{t("how.to.use")}</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>{t("upload.file")}:</strong> {t("upload.file.desc")}
          </li>
          <li>
            <strong>{t("fetch.remote")}:</strong> {t("fetch.remote.desc")}
          </li>
          <li>
            <strong>{t("manual.addition")}:</strong> {t("manual.addition.desc")}{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded">content</code>
          </li>
          <li>{t("view.contents")}</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6 mb-4">{t("export.features")}</h2>
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-gray-900 p-2 rounded-md">
              <FileDown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">{t("export.to.pdf")}</h3>
              <p className="text-gray-600">{t("export.to.pdf.desc")}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-700 p-2 rounded-md">
              <FileWord className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">{t("export.to.word")}</h3>
              <p className="text-gray-600">{t("export.to.word.desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
