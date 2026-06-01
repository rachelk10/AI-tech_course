# v0-digital-course-website

קורס Machine Learning מקיף בעברית עם מערכת כניסת משתמשים מלאה.

## 🎯 תכונות

- ✅ **מערכת התחברות מלאה** - הרשמה, התחברות, Google OAuth
- ✅ **ניהול משתמשים** - פרופילים אישיים, מעקב אחר תשלומים
- ✅ **הגנה על תוכן** - רק משתמשים ששילמו יכולים לצפות בסרטונים
- ✅ **ממשק מודרני** - Next.js 16, React 19, Tailwind CSS
- ✅ **בסיס נתונים** - Prisma + PostgreSQL

## � **[➡️ קרא את התיעוד המלא ב-INDEX.md](INDEX.md)**

## 🚀 התחלה מהירה (4 צעדים)

```bash
# 1. התקן חבילות
npm install --force

# 2. ערוך .env.local
# הוסף: DATABASE_URL, NEXTAUTH_SECRET

# 3. צור טבלאות
npm run db:migrate

# 4. הרץ
npm run dev
```

**📖 הוראות מפורטות:**
- **[SUMMARY.md](SUMMARY.md)** - סיכום בעמוד אחד ⭐
- **[QUICKSTART.md](QUICKSTART.md)** - מדריך 5 דקות
- **[COMMANDS.md](COMMANDS.md)** - פקודות להעתקה

## 🛠️ טכנולוגיות

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, Radix UI
- **Auth**: NextAuth.js
- **Database**: Prisma + PostgreSQL
- **Deployment**: Vercel

## 📁 מבנה הפרויקט

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # דפי התחברות/הרשמה
│   ├── profile/           # פרופיל משתמש
│   └── payment/           # רכישת קורס
├── components/            # React components
├── lib/                   # Utilities
├── prisma/               # Database schema
└── scripts/              # כלי עזר
```

## 🔐 מערכת ההתחברות

### תכונות זמינות:
- הרשמה עם מייל/סיסמה (סיסמאות מוצפנות)
- התחברות עם מייל/סיסמה
- כניסה עם Google (אופציונלי)
- דפי פרופיל ותשלום
- הגנה אוטומטית על תוכן

### ניהול משתמשים:
```bash
# פתח ממשק גרפי לבסיס הנתונים
npm run db:studio

# עדכן סטטוס תשלום של משתמש
npx ts-node scripts/update-user-payment.ts user@example.com
```

## 🆘 בעיות?

- **התקנה**: [INSTALL_TROUBLESHOOTING.md](INSTALL_TROUBLESHOOTING.md)
- **שאלות כלליות**: rachelshor100@gmail.com

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_F3ffBy5F38rcJq2WhFpr0hvyAYEn)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/rachelk10/v0-digital-course-website" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
