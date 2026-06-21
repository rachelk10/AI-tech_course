export const REFERRAL_COOKIE_NAME = "referral_code"

export const REFERRAL_CODE_REGEX = /^[A-Za-z0-9_-]{4,64}$/

export const sanitizeReferralCode = (value?: string | null): string | null => {
  const normalized = value?.trim()

  if (!normalized) {
    return null
  }

  return REFERRAL_CODE_REGEX.test(normalized) ? normalized : null
}
