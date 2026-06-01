# 🚨 בעיות התקנה? קרא כאן!

## הבעיה
ייתכן שתראה שגיאות בעת הרצת `npm install` בגלל peer dependency conflicts.

## הפתרון המהיר

### אופציה 1: השתמש בקובץ .npmrc (כבר נוצר)
כבר יש קובץ `.npmrc` שמטפל בזה. פשוט הרץ:
```bash
npm install
```

### אופציה 2: התקן עם --force
```bash
npm install --force
```

### אופציה 3: התקן כל חבילה בנפרד
```bash
npm install next-auth --legacy-peer-deps
npm install bcryptjs --legacy-peer-deps
npm install @prisma/client --legacy-peer-deps
npm install @auth/prisma-adapter --legacy-peer-deps
npm install -D prisma --legacy-peer-deps
npm install -D @types/bcryptjs --legacy-peer-deps
npm install -D ts-node --legacy-peer-deps
```

### אופציה 4: נקה ונסה שוב
```bash
rm -rf node_modules package-lock.json
npm install
```

## אם עדיין לא עובד

### שימוש ב-yarn במקום npm:
```bash
# התקן yarn
npm install -g yarn

# התקן חבילות
yarn install
yarn add next-auth bcryptjs @prisma/client @auth/prisma-adapter
yarn add -D prisma @types/bcryptjs ts-node
```

### שימוש ב-pnpm (המומלץ):
```bash
# התקן pnpm (כבר קיים לפי package.json)
npm install -g pnpm

# התקן חבילות
pnpm install
pnpm add next-auth bcryptjs @prisma/client @auth/prisma-adapter
pnpm add -D prisma @types/bcryptjs ts-node
```

## בדיקה שהכל הותקן

רשימת החבילות הנדרשות:
- ✅ next-auth
- ✅ bcryptjs
- ✅ @prisma/client
- ✅ @auth/prisma-adapter
- ✅ prisma (dev)
- ✅ @types/bcryptjs (dev)
- ✅ ts-node (dev)

בדוק ב-`package.json` שהן מופיעות תחת `dependencies` או `devDependencies`.

## אם הכל הותקן בהצלחה

המשך לשלב הבא:
```bash
# יצירת טבלאות
npm run db:migrate

# הרצת הפרויקט
npm run dev
```

## עדיין יש בעיה?

1. בדוק שיש לך Node.js גרסה 18 ומעלה:
   ```bash
   node --version
   ```

2. עדכן npm:
   ```bash
   npm install -g npm@latest
   ```

3. נקה cache של npm:
   ```bash
   npm cache clean --force
   ```

4. נסה להתקין שוב

---

**הערה:** אזהרות (warnings) זה בסדר. רק שגיאות (errors) הן בעיה.

אם אתה רואה "Cannot read properties of null" - זו שגיאה ידועה עם npm. השתמש ב-pnpm או yarn במקום.
