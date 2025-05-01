"use server"

import fs from "fs"
import path from "path"
import { revalidatePath } from "next/cache"

export async function uploadMarkdownFile(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file type
    if (!file.name.endsWith(".md")) {
      return { success: false, error: "Only markdown (.md) files are allowed" }
    }

    // Sanitize filename to prevent directory traversal attacks
    const sanitizedFilename = path.basename(file.name).replace(/[^a-zA-Z0-9-_.]/g, "-")

    // Create content directory if it doesn't exist
    const contentDir = path.join(process.cwd(), "content")
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
    }

    // Check if file already exists
    const filePath = path.join(contentDir, sanitizedFilename)
    if (fs.existsSync(filePath)) {
      return { success: false, error: "A file with this name already exists" }
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Write file to disk
    fs.writeFileSync(filePath, buffer)

    // Revalidate the home page to show the new file
    revalidatePath("/")

    return { success: true, filename: sanitizedFilename }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, error: "Failed to upload file" }
  }
}

export async function fetchRemoteMarkdown(url: string) {
  try {
    // Fetch the markdown content
    const response = await fetch(url)

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch content: ${response.status} ${response.statusText}`,
      }
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
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
    }

    // Write content to file
    const filePath = path.join(contentDir, sanitizedFilename)
    fs.writeFileSync(filePath, content)

    // Revalidate the home page
    revalidatePath("/")

    return { success: true, filename: sanitizedFilename }
  } catch (error) {
    console.error("Error fetching remote markdown:", error)
    return { success: false, error: "Failed to fetch or save remote content" }
  }
}

// We've removed the server-side PDF generation function
