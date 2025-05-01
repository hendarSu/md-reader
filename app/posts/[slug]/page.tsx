"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
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

        // In a real app, this would fetch from the API route
        // For now, we'll use a mock response
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock post data
        const mockPostData = {
          frontmatter: {
            title: slug.replace(/-/g, " "),
            date: new Date().toISOString(),
          },
          content: `
            <h1>${slug.replace(/-/g, " ")}</h1>
            <p>This is a client-side placeholder for the markdown content.</p>
            <h2>Example Section</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <pre><code class="language-javascript">console.log("Hello world");</code></pre>
          `,
          slug,
        }

        setPostData(mockPostData)
      } catch (err) {
        console.error("Error fetching post:", err)
        setError("Failed to load post content")
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
          <div className="animate-pulse text-gray-500">Loading content...</div>
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
