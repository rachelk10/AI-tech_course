# מערכת כניסת משתמשים - מדריך התקנה

## צעדים להפעלת המערכת

### 1. התקנת חבילות
```bash
npm install next-auth bcryptjs @prisma/client @auth/prisma-adapter --legacy-peer-deps
npm install -D prisma @types/bcryptjs
```

### 2. הגדרת בסיס נתונים

#### אופציה א': PostgreSQL מקומי
התקן PostgreSQL ויצור בסיס נתונים:
```sql
CREATE DATABASE course_db;
```

#### אופציה ב': Neon (PostgreSQL בענן - בחינם)
1. היכנס ל-https://neon.tech
2. צור פרויקט חדש
3. העתק את ה-CONNECTION_STRING

#### אופציה ג': Supabase (PostgreSQL בענן - בחינם)
1. היכנס ל-https://supabase.com
2. צור פרויקט חדש
3. לך ל-Project Settings > Database
4. העתק את ה-Connection String

### 3. הגדרת קובץ .env.local
צור קובץ `.env.local` בשורש הפרויקט:

```env
# Database - החלף בכתובת של בסיס הנתונים שלך
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth (אופציונלי - לכניסה עם Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### יצירת NEXTAUTH_SECRET
הרץ:
```bash
openssl rand -base64 32
```

או השתמש באתר: https://generate-secret.vercel.app/32

### 4. הגדרת Google OAuth (אופציונלי)

1. לך ל-https://console.cloud.google.com
2. צור פרויקט חדש או בחר קיים
3. לך ל-"APIs & Services" > "Credentials"
4. לחץ "Create Credentials" > "OAuth 2.0 Client ID"
5. הוסף:
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. העתק את Client ID ו-Client Secret ל-.env.local

### 5. הרצת Prisma

```bash
# יצירת migration ראשון
npx prisma migrate dev --name init

# יצירת Prisma Client
npx prisma generate
```

### 6. הרצת האתר

```bash
npm run dev
```

האתר יהיה זמין ב-http://localhost:3000

## שימוש במערכת

### כמשתמש:
1. לחץ על "הרשמה" בכותרת
2. הירשם עם מייל וסיסמה או Google
3. לאחר התחברות, תוכל לראות את הפרופיל שלך
4. לרכישת הקורס, לחץ על "רכישת הקורס"

### כמנהל - עדכון סטטוס תשלום:

לאחר שמשתמש שילם, עדכן את בסיס הנתונים:

```bash
npx prisma studio
```

או דרך SQL:
```sql
UPDATE "User" SET "hasPaid" = true WHERE email = 'user@example.com';
```

## פתרון בעיות נפוצות

### שגיאת "Database connection"
- בדוק ש-DATABASE_URL נכון ב-.env.local
- בדוק שבסיס הנתונים פועל

### שגיאת "Invalid session"
- בדוק ש-NEXTAUTH_SECRET מוגדר
- נקה cookies ונסה שוב

### בעיות עם Google OAuth
- בדוק שה-redirect URI נכון (http://localhost:3000/api/auth/callback/google)
- בדוק שה-credentials נכונים ב-.env.local

## קבצים חשובים

- `/app/api/auth/[...nextauth]/route.ts` - NextAuth API
- `/app/api/auth/register/route.ts` - הרשמת משתמשים
- `/lib/auth.ts` - הגדרות NextAuth
- `/lib/prisma.ts` - Prisma client
- `/prisma/schema.prisma` - סכמת בסיס הנתונים
- `/middleware.ts` - הגנה על דפים
