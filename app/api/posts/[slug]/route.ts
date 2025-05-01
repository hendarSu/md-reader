import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { parseMarkdown } from "@/lib/markdown"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const filePath = path.join(process.cwd(), "content", `${slug}.md`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read and parse markdown file
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { frontmatter, content } = await parseMarkdown(fileContent)

    // Add language labels to code blocks
    const contentWithCodeLabels = content.replace(
      /<pre><code class="language-([a-z0-9]+)">/g,
      '<div class="code-header">$1</div><pre><code class="language-$1">',
    )

    return NextResponse.json({
      frontmatter,
      content: contentWithCodeLabels,
      slug,
    })
  } catch (error) {
    console.error("Error reading markdown:", error)
    return NextResponse.json({ error: "Failed to read markdown" }, { status: 500 })
  }
}
