"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Upload } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// This is a client-side mock for the demo
// In a real app, you'd use a server action or API route
const mockUploadMarkdownFile = async (formData: FormData) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const file = formData.get("file") as File

  if (!file) {
    return { success: false, error: "No file provided" }
  }

  if (!file.name.endsWith(".md")) {
    return { success: false, error: "Only markdown (.md) files are allowed" }
  }

  // Simulate successful upload
  return { success: true, filename: file.name }
}

export default function UploadPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    // Check if it's a markdown file
    if (!file.name.endsWith(".md")) {
      setError("Only markdown (.md) files are allowed")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append("file", file)

      // Call the mock upload function
      const result = await mockUploadMarkdownFile(formData)

      if (result.success) {
        setSuccess(true)
        // Simulate redirect after successful upload
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setError(result.error || "Failed to upload file")
      }
    } catch (err) {
      setError("An error occurred while uploading the file")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ChevronLeft className="h-4 w-4 mr-1" />
        {t("back.to.all.files")}
      </Link>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t("upload.markdown.file")}</h1>

        {success ? (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-green-700">{t("file.uploaded")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                {t("select.markdown.file")}
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">{t("click.to.upload")}</span> {t("drag.and.drop")}
                    </p>
                    <p className="text-xs text-gray-500">{t("markdown.files.only")}</p>
                    {file && (
                      <p className="mt-2 text-sm text-gray-700 font-medium">
                        {t("selected")}: {file.name}
                      </p>
                    )}
                  </div>
                  <input
                    id="file"
                    type="file"
                    accept=".md"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isUploading ? t("uploading") : t("upload.file.button")}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
