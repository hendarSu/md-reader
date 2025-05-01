import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, error: "No URL provided" }, { status: 400 })
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch (err) {
      return NextResponse.json({ success: false, error: "Invalid URL format" }, { status: 400 })
    }

    // Fetch the markdown content
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch content: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const content = await response.text()

    // Extract filename from URL
    const urlObj = new URL(url)
    let filename = path.basename(urlObj.pathname)

    // If no filename or doesn't end with .md, create a default one
    if (!filename || !filename.endsWith(".md")) {
      filename = `remote-content-${Date.now()}.md`
    }

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9-_.]/g, "-")

    // Create content directory if it doesn't exist
    const contentDir = path.join(process.cwd(), "content")
    if (!existsSync(contentDir)) {
      await mkdir(contentDir, { recursive: true })
    }

    // Write content to file
    const filePath = path.join(contentDir, sanitizedFilename)
    await writeFile(filePath, content)

    return NextResponse.json({ success: true, filename: sanitizedFilename })
  } catch (error) {
    console.error("Error fetching remote markdown:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch or save remote content" }, { status: 500 })
  }
}
