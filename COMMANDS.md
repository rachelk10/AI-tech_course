# 🚀 פקודות Copy-Paste מהירות

## התקנה ראשונית

```bash
# התקן חבילות
npm install --force

# או אם לא עובד:
npm install next-auth bcryptjs @prisma/client @auth/prisma-adapter --legacy-peer-deps
npm install -D prisma @types/bcryptjs ts-node --legacy-peer-deps
```

## יצירת NEXTAUTH_SECRET

```bash
# Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Mac/Linux
openssl rand -base64 32

# או השתמש באתר:
# https://generate-secret.vercel.app/32
```

## בסיס נתונים

```bash
# יצירת טבלאות (הרץ פעם אחת)
npm run db:migrate

# כשיישאל "Enter a name for the new migration":
# כתוב: init
# ולחץ Enter

# הוספת משתמשי דוגמה (אופציונלי)
npm run db:seed

# פתיחת ממשק גרפי לבסיס הנתונים
npm run db:studio
```

## הרצת הפרויקט

```bash
# הפעלה
npm run dev

# האתר יהיה זמין ב:
# http://localhost:3000
```

## ניהול משתמשים

```bash
# עדכון סטטוס תשלום של משתמש
npx ts-node scripts/update-user-payment.ts user@example.com

# פתיחת Prisma Studio (ממשק גרפי)
npm run db:studio
```

## פקודות Prisma שימושיות

```bash
# יצירת Prisma Client
npm run db:generate

# דחיפת שינויים לבסיס נתונים (ללא migration)
npm run db:push

# איפוס בסיס נתונים (מחיקת הכל!)
npx prisma migrate reset

# הצגת כל הטבלאות
npx prisma db pull
```

## בעיות? נקה הכל והתחל מחדש

```bash
# Windows PowerShell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install --force

# Mac/Linux
rm -rf node_modules package-lock.json
npm install --force
```

## שינוי ל-pnpm (מומלץ אם npm לא עובד)

```bash
# התקן pnpm
npm install -g pnpm

# התקן חבילות
pnpm install

# הוסף חבילות חדשות
pnpm add next-auth bcryptjs @prisma/client @auth/prisma-adapter
pnpm add -D prisma @types/bcryptjs ts-node

# הרץ פקודות
pnpm run dev
pnpm run db:migrate
pnpm run db:studio
```

## עדכון בסיס נתונים ישירות (SQL)

```sql
-- סמן משתמש כמי ששילם
UPDATE "User" SET "hasPaid" = true WHERE email = 'user@example.com';

-- הצג את כל המשתמשים
SELECT id, email, name, "hasPaid", "createdAt" FROM "User";

-- מחק משתמש
DELETE FROM "User" WHERE email = 'user@example.com';

-- ספור כמה משתמשים שילמו
SELECT COUNT(*) FROM "User" WHERE "hasPaid" = true;
```

## טיפים מהירים

```bash
# בדיקת גרסת Node
node --version
# צריך להיות 18 ומעלה

# עדכון npm
npm install -g npm@latest

# ניקוי cache של npm
npm cache clean --force

# בדיקת איזה חבילות חסרות
npm ls next-auth
npm ls prisma
npm ls bcryptjs
```

## קישורים שימושיים

- **Neon (DB חינם)**: https://neon.tech
- **Supabase (DB חינם)**: https://supabase.com
- **Google Console (OAuth)**: https://console.cloud.google.com
- **יצירת Secret**: https://generate-secret.vercel.app/32

---

**💡 טיפ:** העתק את הפקודות ישירות מכאן!
