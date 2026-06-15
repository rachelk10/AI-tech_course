import Link from "next/link"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { promises as fs } from "fs"
import path from "path"
import { ExternalReferrerForm } from "@/components/referrals/external-referrer-form"
import { BatchReferrerForm } from "@/components/referrals/batch-referrer-form"

export const dynamic = "force-dynamic"

const generateReferralCode = () => crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()

async function ensureReferralCodesForExistingUsers() {
  const usersWithoutCode = await prisma.user.findMany({
    where: { referralCode: null },
    select: { id: true },
  })

  if (usersWithoutCode.length === 0) {
    return
  }

  const existingCodes = await prisma.user.findMany({
    where: { NOT: { referralCode: null } },
    select: { referralCode: true },
  })

  const externalCodes = await prisma.referrer.findMany({
    select: { referralCode: true },
  })

  const usedCodes = new Set(
    [...existingCodes, ...externalCodes]
      .map((row) => row.referralCode)
      .filter((value): value is string => typeof value === "string"),
  )

  const updates = usersWithoutCode.map(async (user) => {
    let code = generateReferralCode()
    while (usedCodes.has(code)) {
      code = generateReferralCode()
    }
    usedCodes.add(code)

    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: code },
    })
  })

  await Promise.all(updates)
}

export default async function AdminLinksPage() {
  const requestHeaders = await headers()
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000"
  const baseUrl = `${protocol}://${host}`

  try {
    // Try to use Prisma if available (may fail in file-only mode)
    let users = []
    try {
      await ensureReferralCodesForExistingUsers()

      users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          referralCode: true,
          createdAt: true,
          referredBy: {
            select: {
              name: true,
              email: true,
            },
          },
          referredByReferrer: {
            select: {
              name: true,
              email: true,
              referralCode: true,
            },
          },
          _count: {
            select: {
              referrals: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } catch (e) {
      // Prisma/DB not available — fallback to empty users list and continue
      console.warn("Prisma not available or DB not synced — rendering admin links in file-only mode.", e)
      users = []
    }

    // Read external referrers from local JSON file (no DB)
    let externalReferrers: Array<any> = []
    try {
      const referrersPath = path.join(process.cwd(), "data", "referrers.json")
      const raw = await fs.readFile(referrersPath, "utf-8")
      externalReferrers = JSON.parse(raw)
      // normalize fields to match Prisma shape used below
      externalReferrers = externalReferrers.map((r) => ({
        id: r.id ?? r.referralCode,
        name: r.name,
        email: r.email ?? null,
        phone: r.phone ?? null,
        referralCode: r.referralCode,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
        leads: Array.isArray(r.leads) ? r.leads : [],
        _count: { referrals: Number(r.count || 0) },
      }))
      externalReferrers.sort((a, b) => {
        if (!a.createdAt) return 1
        if (!b.createdAt) return -1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    } catch (e) {
      externalReferrers = []
    }

    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">דוח הפניות (Referral)</h1>
            <p className="text-sm text-muted-foreground">
              כאן אפשר ליצור לינקים גם לממליצות לא רשומות, ולראות מי המליץ על מי.
            </p>
            <p className="text-sm text-muted-foreground">
              דוגמת לינק: <code>{`${baseUrl}/?ref=XXXXXXXXXX`}</code>
            </p>
            <div className="pt-2">
              <Link href="/" className="text-sm underline">
                חזרה לדף הבית
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ExternalReferrerForm />
            <BatchReferrerForm />
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[1000px] text-right text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2">שם ממליצה חיצונית</th>
                  <th className="px-3 py-2">מייל</th>
                  <th className="px-3 py-2">טלפון</th>
                  <th className="px-3 py-2">קוד</th>
                  <th className="px-3 py-2">לינק שיתוף</th>
                  <th className="px-3 py-2">לקוחות שהגיעו</th>
                  <th className="px-3 py-2">כמה הביאה</th>
                  <th className="px-3 py-2">תאריך יצירה</th>
                </tr>
              </thead>
              <tbody>
                {externalReferrers.map((referrer) => {
                  const referralLink = `${baseUrl}/?ref=${referrer.referralCode}`

                  return (
                    <tr key={referrer.id} className="border-t align-top">
                      <td className="px-3 py-2">{referrer.name}</td>
                      <td className="px-3 py-2">{referrer.email || "-"}</td>
                      <td className="px-3 py-2">{referrer.phone || "-"}</td>
                      <td className="px-3 py-2 font-mono">{referrer.referralCode}</td>
                      <td className="px-3 py-2 font-mono text-xs break-all">{referralLink}</td>
                      <td className="px-3 py-2 text-xs space-y-1">
                        {Array.isArray(referrer.leads) && referrer.leads.length > 0 ? (
                          referrer.leads.map((lead: any, index: number) => (
                            <div key={`${lead.email || lead.name}-${index}`}>
                              {lead.name || "-"} {lead.email ? `(${lead.email})` : ""}
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-3 py-2">{referrer._count.referrals}</td>
                      <td className="px-3 py-2">{new Date(referrer.createdAt).toLocaleString("he-IL")}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[1100px] text-right text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2">שם</th>
                  <th className="px-3 py-2">מייל</th>
                  <th className="px-3 py-2">קוד הפניה אישי</th>
                  <th className="px-3 py-2">לינק שיתוף</th>
                  <th className="px-3 py-2">הומלץ ע\"י</th>
                  <th className="px-3 py-2">כמה הביאה</th>
                  <th className="px-3 py-2">תאריך הרשמה</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const referralLink = user.referralCode
                    ? `${baseUrl}/auth/signup?ref=${user.referralCode}`
                    : "-"

                  return (
                    <tr key={user.id} className="border-t align-top">
                      <td className="px-3 py-2">{user.name || "-"}</td>
                      <td className="px-3 py-2">{user.email}</td>
                      <td className="px-3 py-2 font-mono">{user.referralCode || "-"}</td>
                      <td className="px-3 py-2 font-mono text-xs break-all">{referralLink}</td>
                      <td className="px-3 py-2">
                        {user.referredBy
                          ? `${user.referredBy.name || ""} (${user.referredBy.email})`
                          : user.referredByReferrer
                            ? `${user.referredByReferrer.name} (חיצונית: ${user.referredByReferrer.referralCode})`
                            : "-"}
                      </td>
                      <td className="px-3 py-2">{user._count.referrals}</td>
                      <td className="px-3 py-2">{new Date(user.createdAt).toLocaleString("he-IL")}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Admin links page error:", error)

    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-3xl space-y-3 rounded-xl border p-6">
          <h1 className="text-xl font-bold">העמוד לא זמין כרגע</h1>
          <p className="text-sm text-muted-foreground">
            נראה שבסביבת הפרודקשן בסיס הנתונים עדיין לא מסונכרן עם שדות ההפניה החדשים.
          </p>
          <p className="text-sm text-muted-foreground">
            אחרי סנכרון DB (migrate/push) העמוד יחזור לעבוד כרגיל.
          </p>
          <div className="pt-2">
            <Link href="/" className="text-sm underline">
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </main>
    )
  }
}
