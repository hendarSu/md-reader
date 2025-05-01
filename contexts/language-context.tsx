"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define available languages
export type Language = "en" | "id"

// Define the context type
type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

// Translations
const translations = {
  en: {
    // Navigation
    "back.to.all.files": "Back to all files",

    // Home page
    "app.title": "Markdown Reader",
    "upload.file": "Upload File",
    "fetch.remote": "Fetch Remote",
    "no.files.found": "No markdown files found. Upload a file or fetch from a remote URL.",

    // How to use section
    "how.to.use": "How to use",
    "upload.file.desc": "Upload markdown (.md) files from your device",
    "fetch.remote.desc": "Import markdown from a URL (like GitHub raw content)",
    "manual.addition": "Manual addition",
    "manual.addition.desc": "Add files directly to the content directory",
    "view.contents": "Click on any file from the list above to view its formatted contents",

    // Export features
    "export.features": "Export Features",
    "export.to.pdf": "Export to PDF",
    "export.to.pdf.desc":
      'Convert any markdown file to PDF format for easy sharing and printing. Click the "Print / PDF" button when viewing a document, and use your browser\'s print dialog to save as PDF.',
    "export.to.word": "Export to Word",
    "export.to.word.desc":
      'Download your markdown content as a Microsoft Word (.docx) document for further editing. Click the "Export to Word" button when viewing a document to download it immediately.',

    // Upload page
    "upload.markdown.file": "Upload Markdown File",
    "select.markdown.file": "Select Markdown File",
    "click.to.upload": "Click to upload",
    "drag.and.drop": "or drag and drop",
    "markdown.files.only": "Markdown files only (.md)",
    selected: "Selected",
    uploading: "Uploading...",
    "upload.file.button": "Upload File",

    // Remote fetch page
    "fetch.remote.markdown": "Fetch Remote Markdown",
    "remote.markdown.url": "Remote Markdown URL",
    "enter.url": "Enter the URL of a raw markdown file (e.g., GitHub raw content URL)",
    fetching: "Fetching...",
    "fetch.and.save": "Fetch and Save",

    // Export buttons
    preparing: "Preparing...",
    "print.pdf": "Print / PDF",
    exporting: "Exporting...",
    "export.word": "Export to Word",

    // Language switcher
    language: "Language",
    english: "English",
    indonesian: "Indonesian",

    // Success messages
    "file.uploaded": "File uploaded successfully! Redirecting to home page...",
    "content.fetched": "Markdown content fetched and saved successfully!",
    "view.all.files": "View All Files",
  },
  id: {
    // Navigation
    "back.to.all.files": "Kembali ke semua file",

    // Home page
    "app.title": "Pembaca Markdown",
    "upload.file": "Unggah File",
    "fetch.remote": "Ambil dari URL",
    "no.files.found": "Tidak ada file markdown yang ditemukan. Unggah file atau ambil dari URL.",

    // How to use section
    "how.to.use": "Cara Penggunaan",
    "upload.file.desc": "Unggah file markdown (.md) dari perangkat Anda",
    "fetch.remote.desc": "Impor markdown dari URL (seperti konten mentah GitHub)",
    "manual.addition": "Penambahan manual",
    "manual.addition.desc": "Tambahkan file langsung ke direktori content",
    "view.contents": "Klik file apa saja dari daftar di atas untuk melihat kontennya",

    // Export features
    "export.features": "Fitur Ekspor",
    "export.to.pdf": "Ekspor ke PDF",
    "export.to.pdf.desc":
      'Konversi file markdown ke format PDF untuk berbagi dan mencetak. Klik tombol "Cetak / PDF" saat melihat dokumen, dan gunakan dialog cetak browser untuk menyimpan sebagai PDF.',
    "export.to.word": "Ekspor ke Word",
    "export.to.word.desc":
      'Unduh konten markdown Anda sebagai dokumen Microsoft Word (.docx) untuk pengeditan lebih lanjut. Klik tombol "Ekspor ke Word" saat melihat dokumen untuk mengunduhnya segera.',

    // Upload page
    "upload.markdown.file": "Unggah File Markdown",
    "select.markdown.file": "Pilih File Markdown",
    "click.to.upload": "Klik untuk mengunggah",
    "drag.and.drop": "atau seret dan lepas",
    "markdown.files.only": "Hanya file markdown (.md)",
    selected: "Dipilih",
    uploading: "Mengunggah...",
    "upload.file.button": "Unggah File",

    // Remote fetch page
    "fetch.remote.markdown": "Ambil Markdown dari URL",
    "remote.markdown.url": "URL Markdown",
    "enter.url": "Masukkan URL file markdown mentah (mis., URL konten mentah GitHub)",
    fetching: "Mengambil...",
    "fetch.and.save": "Ambil dan Simpan",

    // Export buttons
    preparing: "Menyiapkan...",
    "print.pdf": "Cetak / PDF",
    exporting: "Mengekspor...",
    "export.word": "Ekspor ke Word",

    // Language switcher
    language: "Bahasa",
    english: "Inggris",
    indonesian: "Indonesia",

    // Success messages
    "file.uploaded": "File berhasil diunggah! Mengalihkan ke halaman utama...",
    "content.fetched": "Konten markdown berhasil diambil dan disimpan!",
    "view.all.files": "Lihat Semua File",
  },
}

// Create the provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Try to get the language from localStorage, default to 'en'
  const [language, setLanguageState] = useState<Language>("en")

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "id")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Update localStorage when language changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  return useContext(LanguageContext)
}
