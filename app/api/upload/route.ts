import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith(".md")) {
      return NextResponse.json({ success: false, error: "Only markdown (.md) files are allowed" }, { status: 400 })
    }

    // Sanitize filename to prevent directory traversal attacks
    const sanitizedFilename = path.basename(file.name).replace(/[^a-zA-Z0-9-_.]/g, "-")

    // Create content directory if it doesn't exist
    const contentDir = path.join(process.cwd(), "content")
    if (!existsSync(contentDir)) {
      await mkdir(contentDir, { recursive: true })
    }

    // Check if file already exists
    const filePath = path.join(contentDir, sanitizedFilename)
    if (existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "A file with this name already exists" }, { status: 409 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to disk
    await writeFile(filePath, buffer)

    return NextResponse.json({ success: true, filename: sanitizedFilename })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 })
  }
}
