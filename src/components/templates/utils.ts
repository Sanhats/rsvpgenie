import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fontOptions = [
  { value: "font-sans", label: "Sans Serif" },
  { value: "font-serif", label: "Serif" },
  { value: "font-mono", label: "Monospace" },
  { value: "font-cursive", label: "Cursive" },
]

export const colorOptions = [
  { value: "slate", label: "Slate" },
  { value: "gray", label: "Gray" },
  { value: "zinc", label: "Zinc" },
  { value: "neutral", label: "Neutral" },
  { value: "stone", label: "Stone" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "amber", label: "Amber" },
  { value: "yellow", label: "Yellow" },
  { value: "lime", label: "Lime" },
  { value: "green", label: "Green" },
  { value: "emerald", label: "Emerald" },
  { value: "teal", label: "Teal" },
  { value: "cyan", label: "Cyan" },
  { value: "sky", label: "Sky" },
  { value: "blue", label: "Blue" },
  { value: "indigo", label: "Indigo" },
  { value: "violet", label: "Violet" },
  { value: "purple", label: "Purple" },
  { value: "fuchsia", label: "Fuchsia" },
  { value: "pink", label: "Pink" },
  { value: "rose", label: "Rose" },
]

export function getColorClasses(template: string, primaryColor: string, secondaryColor: string) {
  const getColor = (color: string, opacity: number) => `${color}-${opacity}`

  const templateStyles = {
    elegant: {
      bg: getColor(primaryColor, 50),
      text: getColor(primaryColor, 900),
      accent: getColor(secondaryColor, 500),
      border: getColor(primaryColor, 200),
      card: getColor(primaryColor, 100),
    },
    modern: {
      bg: getColor(primaryColor, 900),
      text: getColor(primaryColor, 50),
      accent: getColor(secondaryColor, 400),
      border: getColor(primaryColor, 700),
      card: getColor(primaryColor, 800),
    },
    fun: {
      bg: getColor(primaryColor, 100),
      text: getColor(primaryColor, 800),
      accent: getColor(secondaryColor, 500),
      border: getColor(primaryColor, 300),
      card: getColor(primaryColor, 200),
    },
  }

  const templateType = template === "template1" ? "elegant" : template === "template2" ? "modern" : "fun"
  const styles = templateStyles[templateType]

  return {
    bg: `bg-${styles.bg}`,
    text: `text-${styles.text}`,
    accent: `text-${styles.accent}`,
    border: `border-${styles.border}`,
    card: `bg-${styles.card}`,
    hover: `hover:bg-${getColor(primaryColor, templateType === "modern" ? 700 : 300)}`,
  }
}

