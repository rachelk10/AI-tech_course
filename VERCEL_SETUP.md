# הגדרות Vercel - Environment Variables

## משתני סביבה להוסיף ב-Vercel Settings

### שלב 1: כניסה להגדרות
1. פתחי: https://vercel.com/dashboard
2. בחרי את הפרויקט שלך
3. לחצי **Settings** → **Environment Variables**

### שלב 2: הוסיפי את המשתנים האלה

#### 1. DATABASE_URL
```
postgresql://neondb_owner:npg_iMdKUjoc7Pk4@ep-muddy-dawn-albiv553.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
```
- סביבות: ✅ Production, ✅ Preview, ✅ Development

#### 2. NEXTAUTH_SECRET
```
kRncBmAQENX74L3ciV+AF92OAA3oPDM2Nl+zolxSLCk=
```
- סביבות: ✅ Production, ✅ Preview, ✅ Development

#### 3. NEXTAUTH_URL
```
https://YOUR-VERCEL-URL.vercel.app
```
**⚠️ חשוב:** החליפי `YOUR-VERCEL-URL` ב-URL האמיתי של האתר שלך ב-Vercel!
- סביבות: ✅ Production, ✅ Preview

**או** אם יש לך דומיין מותאם אישית:
```
https://www.your-domain.com
```

#### 4. GOOGLE_CLIENT_ID (אופציונלי - רק אם רוצה Google login)
```
(להשיג מ-Google Cloud Console)
```
- סביבות: ✅ Production, ✅ Preview, ✅ Development

#### 5. GOOGLE_CLIENT_SECRET (אופציונלי)
```
(להשיג מ-Google Cloud Console)
```
- סביבות: ✅ Production, ✅ Preview, ✅ Development

---

## שלב 3: Redeploy

אחרי הוספת המשתנים:
1. לחצי **Deployments** (בתפריט עליון)
2. מצאי את הדיפלוי האחרון
3. לחצי על שלוש הנקודות (...) → **Redeploy**
4. סמני ✅ **Use existing Build Cache**
5. לחצי **Redeploy**

---

## ✅ בדיקה

אחרי ה-Redeploy:
1. פתחי את האתר ב-Vercel URL
2. תראי את כפתורי **הרשמה** ו**התחברות** בפינה הימנית העליונה
3. נסי להירשם עם מייל וסיסמה
4. וודאי שזה עובד!

---

## 🚨 אם משתמשים ב-Google OAuth

אם רוצה לאפשר התחברות עם Google, צריך גם:

1. **Google Cloud Console**: https://console.cloud.google.com
2. **APIs & Services** → **Credentials**
3. בחרי את ה-OAuth 2.0 Client ID שיצרת
4. **Authorized redirect URIs** → הוסיפי:
   ```
   https://YOUR-VERCEL-URL.vercel.app/api/auth/callback/google
   ```
   (החליפי `YOUR-VERCEL-URL` ב-URL האמיתי)

---

## 📝 הערות חשובות

- ✅ בסיס הנתונים (Neon) כבר מוכן ועובד
- ✅ הטבלאות כבר נוצרו
- ✅ הקוד כבר בגיט
- ⚠️ **רק צריך להוסיף משתני סביבה ב-Vercel**
- 🔒 אל תשתפי את הסיסמאות או ה-SECRETS בציבורי!

---

## 🎉 זהו!

אחרי זה האתר יעבוד ב-Vercel עם כניסת משתמשים מלאה! 🚀
