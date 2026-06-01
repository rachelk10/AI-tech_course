# 📝 TODO - דברים לעשות בעתיד

## 🔴 דחוף (לפני production)

### אבטחה
- [ ] שנה את `NEXTAUTH_SECRET` ב-.env.local (הרץ: `openssl rand -base64 32`)
- [ ] ודא ש-.env.local לא נמצא ב-Git
- [ ] הגדר NEXTAUTH_URL לדומיין האמיתי (לא localhost)
- [ ] הגבל rate limiting על API routes
- [ ] הוסף CSRF protection

### בסיס נתונים
- [ ] העבר מ-dev ל-production database
- [ ] הגדר backups אוטומטיים
- [ ] בדוק performance של queries
- [ ] הוסף indexes לטבלאות

### Google OAuth (אם רוצה)
- [ ] צור Google Cloud Project
- [ ] הגדר OAuth consent screen
- [ ] קבל Client ID + Secret
- [ ] הוסף ל-.env.local
- [ ] הוסף redirect URIs בGoogle Console

## 🟡 חשוב (בקרוב)

### מערכת תשלום אמיתית
- [ ] בחר ספק תשלום (Stripe מומלץ)
- [ ] הגדר חשבון
- [ ] הוסף Stripe SDK
- [ ] צור Webhook לאישור תשלום
- [ ] עדכן `/app/api/payment/confirm/route.ts`
- [ ] בדיקות עם testnet

### שליחת מיילים
- [ ] בחר ספק (SendGrid/Resend)
- [ ] הוסף email templates
- [ ] שלח מייל אימות בהרשמה
- [ ] שלח מייל אישור תשלום
- [ ] הוסף "שכחתי סיסמה"

### ניהול תוכן
- [ ] העלה סרטונים לאחסון ענן (Cloudflare Stream/Vimeo)
- [ ] עדכן VideoPlayer עם URLs אמיתיים
- [ ] הוסף progress tracking (איזה סרטון צפה)
- [ ] הוסף bookmarks/favorites

## 🟢 רצוי (לאחר השקה)

### לוח בקרה למנהל
- [ ] דף admin (רק למנהלים)
- [ ] רשימת כל המשתמשים
- [ ] סטטיסטיקות (כמה נרשמו, כמה שילמו)
- [ ] אישור/דחייה של משתמשים
- [ ] ייצוא לExcel

### חוויית משתמש
- [ ] הוסף "זכור אותי" בהתחברות
- [ ] הוסף "שכחתי סיסמה"
- [ ] אפשר עריכת פרופיל (שם, תמונה)
- [ ] הוסף אישורים בפעולות (מחיקה, התנתקות)
- [ ] Dark mode toggle

### SEO ו-Analytics
- [ ] הוסף meta tags
- [ ] הוסף Open Graph tags
- [ ] הגדר Google Analytics
- [ ] הוסף sitemap.xml
- [ ] הוסף robots.txt

### Performance
- [ ] הוסף caching לAPI routes
- [ ] אופטימיזציה של תמונות
- [ ] lazy loading לקומפוננטים
- [ ] CDN לסטטיים
- [ ] database connection pooling

### בדיקות
- [ ] כתוב unit tests
- [ ] כתוב integration tests
- [ ] E2E tests עם Playwright
- [ ] בדוק accessibility
- [ ] בדוק על מובייל

## 🔵 רעיונות לעתיד

### תכונות נוספות
- [ ] פורום/קהילה למשתמשים
- [ ] מערכת שאלות ותשובות
- [ ] quiz בסוף כל שיעור
- [ ] תעודת סיום
- [ ] שיתוף פרויקטים
- [ ] מערכת דירוגים וביקורות

### Gamification
- [ ] נקודות על השלמת שיעורים
- [ ] badges/achievements
- [ ] leaderboard
- [ ] progress bar
- [ ] daily streak

### Social
- [ ] שיתוף הישגים ברשתות
- [ ] הזמן חבר - קבל הנחה
- [ ] מערכת referral
- [ ] קבוצות לימוד

---

## 📌 הערות

### מה כבר עובד ✅
- הרשמה והתחברות
- Google OAuth (צריך רק להגדיר)
- פרופיל משתמש
- הגנה על תוכן
- כפתורים בניווט
- בסיס נתונים

### מה צריך עבודה 🚧
- מערכת תשלום (כרגע רק דמה)
- סרטונים (כרגע placeholder)
- מיילים (אין שליחה)

### מה ניתן לדחות ⏳
- תכונות מתקדמות
- לוח בקרה
- gamification
- social features

---

**עדיפויות**: אבטחה → תשלום → סרטונים → שאר הכל

עדכן קובץ זה כל פעם שמסיים משימה!
