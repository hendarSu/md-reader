import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import rehypePrism from "rehype-prism-plus"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

export interface Frontmatter {
  title?: string
  date?: string
  author?: string
  description?: string
  [key: string]: any
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter
  content: string
}

export async function parseMarkdown(markdown: string): Promise<ParsedMarkdown> {
  try {
    // Extract frontmatter and content
    const { data, content } = matter(markdown)

    // Process markdown with syntax highlighting
    const processedContent = await remark()
      .use(remarkGfm) // Support GitHub Flavored Markdown
      .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML AST
      .use(rehypePrism, {
        showLineNumbers: false, // Disable line numbers for cleaner look
        ignoreMissing: true, // Don't throw on missing language
        aliases: {
          js: "javascript",
          ts: "typescript",
        },
      }) // Add syntax highlighting
      .use(rehypeStringify, { allowDangerousHtml: true }) // Convert AST to HTML string
      .process(content)

    return {
      frontmatter: data as Frontmatter,
      content: processedContent.toString(),
    }
  } catch (error) {
    console.error("Error parsing markdown:", error)
    // Return empty frontmatter and original content if parsing fails
    return {
      frontmatter: {},
      content: markdown,
    }
  }
}
