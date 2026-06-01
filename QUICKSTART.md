# 🚀 הוראות התחלה מהירות - מערכת התחברות

## מה נוצר?

נוצרה מערכת כניסת משתמשים מלאה עם:
- ✅ הרשמה והתחברות (מייל/סיסמה + Google)
- ✅ כפתורים בכותרת האתר
- ✅ דפי פרופיל ותשלום
- ✅ הגנה על תוכן הקורס
- ✅ מעקב אחר מי ששילם

## צעדים להפעלה (5 דקות)

### 1️⃣ התקנת חבילות
פתח טרמינל והרץ:
```bash
npm install next-auth bcryptjs @prisma/client @auth/prisma-adapter --legacy-peer-deps
npm install -D prisma @types/bcryptjs ts-node
```

### 2️⃣ בסיס נתונים (בחר אחת)

#### אופציה א' - Neon (מומלץ, חינם, 2 דקות):
1. לך ל https://neon.tech
2. לחץ "Sign up" (התחבר עם GitHub)
3. לחץ "Create project"
4. תן שם לפרויקט
5. העתק את ה-"Connection String"

#### אופציה ב' - Supabase (חינם):
1. לך ל https://supabase.com
2. צור פרויקט חדש
3. לך ל Settings > Database
4. העתק "Connection String" (Connection Pooling)

### 3️⃣ עדכון קובץ .env.local
פתח את הקובץ `.env.local` ועדכן:

```env
# הדבק את ה-Connection String שהעתקת:
DATABASE_URL="postgresql://..."

# צור סוד אקראי - הרץ בטרמינל:
# openssl rand -base64 32
NEXTAUTH_SECRET="הדבק-כאן-את-הסוד-שנוצר"

# זה תקין כמו שהוא:
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth - אופציונלי, אפשר להשאיר ריק:
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4️⃣ יצירת טבלאות בבסיס הנתונים
```bash
npm run db:migrate
```

כשיישאל "Enter a name for the new migration", כתוב: `init`

### 5️⃣ הוספת משתמשים לדוגמה (אופציונלי)
```bash
npm run db:seed
```

זה ייצור 2 משתמשים:
- free@example.com / password123 (לא שילם)
- paid@example.com / password123 (שילם)

### 6️⃣ הפעלת האתר
```bash
npm run dev
```

פתח דפדפן ולך ל: http://localhost:3000

## ✨ בדיקה מהירה

1. תראה כפתורים "הרשמה" ו"התחברות" בכותרת
2. לחץ "הרשמה"
3. מלא פרטים ותירשם
4. תתחבר אוטומטית
5. תראה תפריט משתמש במקום הכפתורים

## 💰 סימולציית תשלום

כדי לסמן משתמש כ"שילם":

```bash
# פתח ממשק גרפי לבסיס הנתונים
npm run db:studio

# באתר שנפתח:
# 1. לחץ על "User"
# 2. מצא את המשתמש
# 3. שנה "hasPaid" ל-true
# 4. לחץ "Save"
```

## 📁 קבצים חשובים

- `.env.local` - משתני סביבה (סודות)
- `prisma/schema.prisma` - מבנה בסיס הנתונים
- `lib/auth.ts` - הגדרות התחברות
- `components/auth-buttons.tsx` - הכפתורים בכותרת

## 🆘 בעיות נפוצות

### "Invalid connection string"
➡️ בדוק את DATABASE_URL ב-.env.local

### "Invalid secret"
➡️ הרץ `openssl rand -base64 32` והדבק ל-NEXTAUTH_SECRET

### "Cannot find module"
➡️ הרץ `npm install` שוב

### הכפתורים לא מופיעים
➡️ רענן את הדף (Ctrl+R / Cmd+R)

## 📖 מסמכים נוספים

- [AUTH_README.md](./AUTH_README.md) - הסבר מלא על המערכת
- [AUTH_SETUP.md](./AUTH_SETUP.md) - הוראות מפורטות
- [README.md](./README.md) - תיעוד הפרויקט הכללי

---

**זהו! המערכת מוכנה לשימוש! 🎉**

אם יש שאלות, פנה למייל: rachelshor100@gmail.com
