import { promises as fs } from "fs"
import path from "path"

export const REFERRAL_COOKIE_NAME = "referral_code"

export const REFERRAL_CODE_REGEX = /^[A-Za-z0-9_-]{4,64}$/

export const sanitizeReferralCode = (value?: string | null): string | null => {
  const normalized = value?.trim()

  if (!normalized) {
    return null
  }

  return REFERRAL_CODE_REGEX.test(normalized) ? normalized : null
}

const isReadOnlyRuntime = Boolean(process.env.VERCEL || process.env.NEXT_RUNTIME === "edge")

export const getReferrersDataDir = (): string => {
  if (isReadOnlyRuntime) {
    return path.join("/tmp", "data")
  }
  return path.join(process.cwd(), "data")
}

export const getReferrersFilePath = (): string => path.join(getReferrersDataDir(), "referrers.json")

export const readReferrersFile = async (): Promise<Array<any>> => {
  const referrersPath = getReferrersFilePath()
  const raw = await fs.readFile(referrersPath, "utf-8")
  return JSON.parse(raw) as Array<any>
}

export const writeReferrersFile = async (referrers: Array<any>): Promise<void> => {
  const referrersDir = getReferrersDataDir()
  await fs.mkdir(referrersDir, { recursive: true })
  await fs.writeFile(getReferrersFilePath(), JSON.stringify(referrers, null, 2), "utf-8")
}
