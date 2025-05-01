import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// This is a server-side API route that can safely use fs
export async function GET() {
  try {
    const contentDirectory = path.join(process.cwd(), "content")

    // Check if directory exists
    if (!fs.existsSync(contentDirectory)) {
      return NextResponse.json({ files: [] })
    }

    // Get all markdown files
    const files = fs.readdirSync(contentDirectory).filter((file) => file.endsWith(".md"))

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error reading files:", error)
    return NextResponse.json({ error: "Failed to read files" }, { status: 500 })
  }
}
