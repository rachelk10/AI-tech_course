import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "תקנון ותנאי שימוש | קורס AI",
  description: "תקנון ותנאי שימוש של קורס AI 2026",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 md:py-24" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          חזרה לדף הבית
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">תקנון ותנאי שימוש</h1>
        <p className="text-muted-foreground text-sm mb-10">עדכון אחרון: מאי 2026</p>

        <div className="space-y-10 text-foreground leading-8 text-base">

          <section>
            <h2 className="text-xl font-bold mb-3">1. כללי</h2>
            <p>
              ברוכים הבאים לקורס AI 2026 (&quot;הקורס&quot;), המופעל על ידי רחל שור (&quot;המפעיל&quot;).
              השימוש בקורס ורכישתו כפופים לתנאים המפורטים להלן. בלחיצה על כפתור התשלום ו/או ביצוע רכישה,
              הנך מאשר/ת שקראת, הבנת והסכמת לכל התנאים הכתובים במסמך זה.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. רכישה וגישה לתכנים</h2>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li>לאחר ביצוע תשלום מלא תינתן גישה מלאה לכל תכני הקורס.</li>
              <li>הגישה לתכנים תעמוד לרשותך למשך <strong>3 שנים</strong> ממועד הרכישה.</li>
              <li>הגישה היא אישית ואינה ניתנת להעברה לאחר.</li>
              <li>המפעיל שומר לעצמו את הזכות לעדכן ולשדרג את תכני הקורס מעת לעת.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. מדיניות ביטולים והחזרים</h2>
            <ul className="list-disc list-inside space-y-2 pr-2">
              <li>ניתן לבטל את הרכישה ולקבל החזר מלא עד <strong>14 יום</strong> ממועד הרכישה, בתנאי שלא נצפו יותר מ-20% מתכני הקורס.</li>
              <li>לאחר תקופה זו, או לאחר צפייה ביותר מ-20% מהתכנים, לא יינתן החזר כספי.</li>
              <li>בקשות ביטול יש לשלוח בכתב לכתובת המייל: rachelshor100@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. זכויות יוצרים וקניין רוחני</h2>
            <p>
              כל תכני הקורס — לרבות סרטונים, מצגות, קוד, נוטבוקים ומסמכים — הם רכושו הבלעדי של המפעיל
              ומוגנים בזכויות יוצרים. אין לשכפל, להפיץ, לשתף, להעלות לאינטרנט או לעשות כל שימוש מסחרי בתכנים
              ללא אישור בכתב מראש.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. אחריות ומגבלות</h2>
            <p>
              הקורס מיועד למטרות לימוד בלבד. המפעיל אינו מתחייב לתוצאות ספציפיות, ואינו אחראי לכל נזק
              שיגרם כתוצאה מהשימוש בתכנים. האחריות לשימוש בידע הנרכש מוטלת על הלומד/ת בלבד.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. שינויים בתנאים</h2>
            <p>
              המפעיל שומר לעצמו את הזכות לשנות תנאים אלו בכל עת. שינויים מהותיים יפורסמו באתר ויכנסו לתוקף
              7 ימים לאחר פרסומם.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. יצירת קשר</h2>
            <p>
              לכל שאלה בנוגע לתנאים אלו, ניתן לפנות אלינו:
            </p>
            <ul className="list-none space-y-1 mt-2 pr-2">
              <li>📧 מייל: <a href="mailto:rachelshor100@gmail.com" className="text-primary underline">rachelshor100@gmail.com</a></li>
              <li>📞 טלפון: <a href="tel:0556781514" className="text-primary underline">055-678-1514</a></li>
            </ul>
          </section>

        </div>

        <div className="mt-14 text-center">
          <Link
            href="/#payment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#18122b] via-[#321332] to-[#581c3e] text-white font-semibold hover:scale-105 transition-transform duration-300"
          >
            חזרה לרישום
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
