"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { useLanguage, type Language } from "@/contexts/language-context"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        aria-label={t("language")}
      >
        <Globe className="h-4 w-4" />
        <span>{language === "en" ? t("english") : t("indonesian")}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => changeLanguage("en")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === "en" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
              }`}
            >
              {t("english")}
            </button>
            <button
              onClick={() => changeLanguage("id")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                language === "id" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
              }`}
            >
              {t("indonesian")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
