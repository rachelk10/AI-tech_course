"use client"

import { useState } from "react"

export function BatchReferrerForm() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<Array<{ name: string; email: string | null; link: string }>>([])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResults([])

    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.length === 0) {
      setError("יש להזין שורה אחת לפחות")
      setLoading(false)
      return
    }

    const created: Array<{ name: string; email: string | null; link: string }> = []

    for (const line of lines) {
      // parse as "name,email" or just "name"
      const parts = line.split(",")
      const name = parts[0].trim()
      const email = parts[1]?.trim() || null

      try {
        const res = await fetch("/api/referrers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data?.error || "שגיאה ביצירת קישור")
        }
        created.push({ name, email, link: data?.referrer?.referralLink ?? "" })
      } catch (err) {
        setError(err instanceof Error ? err.message : "שגיאה לא ידועה")
        // continue creating others
      }
    }

    setResults(created)
    setLoading(false)
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <h2 className="text-lg font-semibold">יצירת קב' לינקים (Batch)</h2>
      <p className="text-sm text-muted-foreground">הזן כל שורה בפורמט: שם,מייל (מייל אופציונלי)</p>
      <form onSubmit={onSubmit} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder={`רחל, rachel@example.com\nיעל, yael@example.com\nדנה`}
          rows={6}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-60"
          >
            {loading ? "יוצר לינקים..." : "צור קב' לינקים"}
          </button>
        </div>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">לינקים שנוצרו</h3>
          <ul className="list-disc list-inside text-sm">
            {results.map((r, idx) => (
              <li key={idx} className="font-mono break-all">
                {r.name} {r.email ? `(${r.email})` : ""} — {r.link}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
