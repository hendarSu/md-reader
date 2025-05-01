"use client"

import { useState, useRef } from "react"
import { FileDown, Loader2, FileText } from "lucide-react"
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"
import { useLanguage } from "@/contexts/language-context"

interface ExportButtonsProps {
  slug: string
}

export default function ExportButtons({ slug }: ExportButtonsProps) {
  const { t } = useLanguage()
  const [isPrinting, setIsPrinting] = useState(false)
  const [isExportingWord, setIsExportingWord] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handlePrintPDF = async () => {
    setIsPrinting(true)
    setError(null)

    try {
      // Get the article content
      const articleElement = document.querySelector("article")

      if (!articleElement) {
        throw new Error("Could not find article content")
      }

      // Get title for the PDF
      const titleElement = articleElement.querySelector("h1")
      const title = titleElement ? titleElement.textContent || slug : slug.replace(/-/g, " ")

      // Clone the article to avoid modifying the original
      const clonedArticle = articleElement.cloneNode(true) as HTMLElement

      // Create a printable HTML document
      const printDocument = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            p {
              margin: 1em 0;
            }
            pre {
              background-color: #f5f5f5;
              padding: 10px;
              border-radius: 5px;
              overflow-x: auto;
              font-family: 'Courier New', monospace;
              page-break-inside: avoid;
            }
            code {
              font-family: 'Courier New', monospace;
              background-color: #f5f5f5;
              padding: 2px 4px;
              border-radius: 3px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
              page-break-inside: avoid;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            blockquote {
              border-left: 4px solid #ddd;
              padding-left: 10px;
              margin-left: 0;
              color: #666;
            }
            .code-header {
              background-color: #e0e0e0;
              padding: 5px 10px;
              border-top-left-radius: 5px;
              border-top-right-radius: 5px;
              font-size: 0.8em;
              color: #333;
              border-bottom: 1px solid #ccc;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              pre, code {
                white-space: pre-wrap;
              }
              a {
                text-decoration: none;
                color: #000;
              }
              @page {
                margin: 2cm;
              }
            }
          </style>
        </head>
        <body>
          ${clonedArticle.outerHTML}
          <script>
            // Auto-print when loaded
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 1000);
            };
          </script>
        </body>
        </html>
      `

      // Create a blob from the HTML content
      const blob = new Blob([printDocument], { type: "text/html" })
      const blobUrl = URL.createObjectURL(blob)

      // Create an iframe for printing
      if (iframeRef.current) {
        iframeRef.current.src = blobUrl
        iframeRef.current.onload = () => {
          setIsPrinting(false)
        }
      } else {
        // Fallback if iframe ref is not available
        const printWindow = window.open(blobUrl, "_blank")
        if (printWindow) {
          printWindow.onload = () => {
            setIsPrinting(false)
          }
        } else {
          throw new Error("Could not open print window. Please check if pop-ups are blocked.")
        }
      }
    } catch (err) {
      console.error("Print error:", err)
      setError(`An error occurred: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsPrinting(false)
    }
  }

  const handleExportWord = async () => {
    setIsExportingWord(true)
    setError(null)

    try {
      // Get the article content
      const articleElement = document.querySelector("article")

      if (!articleElement) {
        throw new Error("Could not find article content")
      }

      // Get title for the document
      const titleElement = articleElement.querySelector("h1")
      const title = titleElement ? titleElement.textContent || slug : slug.replace(/-/g, " ")

      // Create a new Document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [],
          },
        ],
      })

      // Create an array to hold all paragraphs
      const children = []

      // Add title
      children.push(
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
        }),
      )

      // Process headings
      articleElement.querySelectorAll("h2, h3, h4, h5, h6").forEach((heading) => {
        const level = Number.parseInt(heading.tagName.charAt(1))
        children.push(
          new Paragraph({
            text: heading.textContent || "",
            heading: level as HeadingLevel,
          }),
        )
      })

      // Process paragraphs
      articleElement.querySelectorAll("p").forEach((paragraph) => {
        children.push(
          new Paragraph({
            children: [new TextRun(paragraph.textContent || "")],
          }),
        )
      })

      // Process code blocks (simplified)
      articleElement.querySelectorAll("pre").forEach((codeBlock) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeBlock.textContent || "",
                font: "Courier New",
              }),
            ],
          }),
        )
      })

      // Add all children to the first section
      doc.addSection({
        children: children,
      })

      // Generate the Word document
      const buffer = await Packer.toBuffer(doc)
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const url = URL.createObjectURL(blob)

      // Create a download link
      const link = document.createElement("a")
      link.href = url
      link.download = `${title.replace(/[^a-zA-Z0-9-_ ]/g, "")}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsExportingWord(false)
    } catch (err) {
      console.error("Word export error:", err)
      setError(`An error occurred: ${err instanceof Error ? err.message : "Unknown error"}`)
      setIsExportingWord(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handlePrintPDF}
        disabled={isPrinting}
        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label="Print or Export to PDF"
      >
        {isPrinting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t("preparing")}
          </>
        ) : (
          <>
            <FileDown className="h-4 w-4 mr-2" />
            {t("print.pdf")}
          </>
        )}
      </button>

      <button
        onClick={handleExportWord}
        disabled={isExportingWord}
        className="inline-flex items-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        aria-label="Export to Word"
      >
        {isExportingWord ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t("exporting")}
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            {t("export.word")}
          </>
        )}
      </button>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {/* Hidden iframe for printing */}
      <iframe ref={iframeRef} style={{ display: "none" }} title="Print Frame" />
    </div>
  )
}
