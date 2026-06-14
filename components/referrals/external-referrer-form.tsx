"use client"

import { useState } from "react"

export function ExternalReferrerForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [createdLink, setCreatedLink] = useState("")

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    setCreatedLink("")

    try {
      const response = await fetch("/api/referrers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: email || undefined,
          phone: phone || undefined,
          referralCode: referralCode || undefined,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.error || "אירעה שגיאה ביצירת הקישור")
      }

      setCreatedLink(data?.referrer?.referralLink ?? "")
      setName("")
      setEmail("")
      setPhone("")
      setReferralCode("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "אירעה שגיאה ביצירת הקישור")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <h2 className="text-lg font-semibold">יצירת לינק לממליצה לא רשומה</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="שם ממליצה"
          required
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="מייל (אופציונלי)"
        />
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="טלפון (אופציונלי)"
        />
        <input
          value={referralCode}
          onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="קוד ידני (אופציונלי)"
        />
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-4 rounded-md bg-black text-white px-3 py-2 text-sm disabled:opacity-60"
        >
          {loading ? "יוצר לינק..." : "צור לינק הפניה"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {createdLink && (
        <p className="text-sm">
          נוצר בהצלחה: <span className="font-mono break-all">{createdLink}</span>
        </p>
      )}
    </div>
  )
}
