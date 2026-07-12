import 'server-only'
import fs from 'fs'
import path from 'path'

/**
 * Which of the six Problems images actually exist on disk.
 *
 * Checked at build time rather than assumed, so dropping a file in enables its
 * card and a missing file falls back to an icon — instead of shipping a broken
 * <img> and a 404. Add or remove images freely; nothing else has to change.
 *
 * Drop files here:  public/problems/problem-1.jpg … problem-6.jpg
 */
const DIR = path.join(process.cwd(), 'public', 'problems')

export function availableProblemImages(): (string | null)[] {
  return Array.from({ length: 6 }, (_, i) => {
    const n = i + 1
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      const file = `problem-${n}.${ext}`
      try {
        if (fs.existsSync(path.join(DIR, file))) return `/problems/${file}`
      } catch {
        // Unreadable directory is the same as "no image" — never throw here.
      }
    }
    return null
  })
}
