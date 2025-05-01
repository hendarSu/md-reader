"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import ExportButtons from "@/components/export-buttons"
import { useLanguage } from "@/contexts/language-context"

interface PostData {
  frontmatter: {
    title?: string
    date?: string
    [key: string]: any
  }
  content: string
  slug: string
}

export default function PostPage() {
  const { t } = useLanguage()
  const params = useParams()
  const slug = params.slug as string
  const [postData, setPostData] = useState<PostData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/posts/${slug}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Post not found")
          }
          throw new Error(`Failed to fetch post: ${response.status}`)
        }

        const data = await response.json()
        setPostData(data)
      } catch (err) {
        console.error("Error fetching post:", err)
        setError(err instanceof Error ? err.message : "Failed to load post content")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="flex items-center text-gray-500">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Loading content...
          </div>
        </div>
      </main>
    )
  }

  if (error || !postData) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error || "Failed to load content"}</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to home page
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("back.to.all.files")}
        </Link>

        <ExportButtons slug={slug} />
      </div>

      <article className="prose prose-slate lg:prose-lg mx-auto">
        {postData.frontmatter?.title ? <h1>{postData.frontmatter.title}</h1> : <h1>{slug.replace(/-/g, " ")}</h1>}

        {postData.frontmatter?.date && (
          <p className="text-gray-500 -mt-4">{new Date(postData.frontmatter.date).toLocaleDateString()}</p>
        )}

        <div dangerouslySetInnerHTML={{ __html: postData.content }} />
      </article>
    </main>
  )
}
