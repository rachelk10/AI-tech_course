"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState, type FormEvent } from "react"
import {
  ArrowLeft,
  Sparkles,
  FileText,
  ChevronDown,
  Play,
  Lock,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { UpdatePopup } from "@/components/update-popup"
import { SyllabusModal } from "@/components/syllabus-modal"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Chapter {
  title: string
  isProject?: boolean
}

interface Module {
  id: number
  title: string
  chapters: Chapter[]
}

const courseModules: Module[] = [
  {
    id: 1,
    title: "יסודות",
    chapters: [
      { title: "מה זה Machine Learning ולמה זה חשוב" },
      { title: "סוגי למידה: Supervised, Unsupervised, Reinforcement" },
      { title: "סביבת עבודה: Python, Jupyter Notebook, Google Colab" },
      { title: "ספריות בסיס: NumPy, Pandas, Matplotlib, Seaborn" },
      { title: "פרויקט: ניתוח דאטה ראשון מקצה לקצה", isProject: true },
    ],
  },
  {
    id: 2,
    title: "עבודה עם דאטה",
    chapters: [
      { title: "מחזור חיי הדאטה" },
      { title: "Exploratory Data Analysis (EDA)" },
      { title: "ניקוי נתונים - ערכים חסרים, כפילויות, Outliers" },
      { title: "Feature Engineering ו-Feature Selection" },
      { title: "Encoding משתנים קטגוריים" },
      { title: "Normalization & Standardization" },
      { title: "פרויקט: עיבוד Dataset אמיתי מ-Kaggle", isProject: true },
    ],
  },
  {
    id: 3,
    title: "Supervised Learning: רגרסיה",
    chapters: [
      { title: "Linear Regression - תיאוריה ואינטואיציה" },
      { title: "Polynomial Regression" },
      { title: "Regularization: Ridge, Lasso, ElasticNet" },
      { title: "Evaluation Metrics: MAE, MSE, RMSE, R²" },
      { title: "פרויקט: חיזוי מחירי דירות", isProject: true },
    ],
  },
  {
    id: 4,
    title: "Model Optimization",
    chapters: [
      { title: "Bias-Variance Tradeoff" },
      { title: "Overfitting ו-Underfitting" },
      { title: "Cross Validation" },
      { title: "Hyperparameter Tuning: GridSearch, RandomSearch, Optuna" },
      { title: "Scikit-learn Pipelines" },
      { title: "פרויקט: אופטימיזציה של מודל קיים", isProject: true },
    ],
  },
  {
    id: 5,
    title: "Supervised Learning: סיווג",
    chapters: [
      { title: "Logistic Regression" },
      { title: "Decision Trees" },
      { title: "Random Forests & Gradient Boosting (XGBoost, LightGBM)" },
      { title: "KNN, SVM, Naive Bayes" },
      { title: "Evaluation: Confusion Matrix, Precision, Recall, F1, ROC-AUC" },
      { title: "התמודדות עם Imbalanced Data" },
      { title: "פרויקט: חיזוי נטישת לקוחות (Churn)", isProject: true },
    ],
  },
  {
    id: 6,
    title: "Unsupervised Learning",
    chapters: [
      { title: "K-Means Clustering" },
      { title: "Hierarchical Clustering" },
      { title: "DBSCAN" },
      { title: "PCA - הורדת ממדים והדמיה" },
      { title: "Anomaly Detection" },
      { title: "פרויקט: סגמנטציית לקוחות", isProject: true },
    ],
  },
  {
    id: 7,
    title: "Deploy בסיסי",
    chapters: [
      { title: "שמירת מודלים: pickle, joblib" },
      { title: "FastAPI - חשיפת מודל כ-API פשוט" },
      { title: "הדגמת קריאה למודל מאפליקציה" },
      { title: "פרויקט: Deploy של מודל הChurn", isProject: true },
    ],
  },
  {
    id: 8,
    title: "פרויקט גמר",
    chapters: [
      { title: "בחירת בעיה עסקית אמיתית" },
      { title: "עבודה מקצה לקצה עצמאית" },
      { title: "תיעוד ב-GitHub" },
      { title: "הצגת תוצאות ומסקנות" },
      { title: "בניית Portfolio", isProject: true },
    ],
  },
]

export default function HomePage() {
  const contactEmailAddress = "rachelshor100@gmail.com"
  const contactMailtoHref = `mailto:${contactEmailAddress}`

  const [modulesCount, setModulesCount] = useState(0)
  const [projectsCount, setProjectsCount] = useState(0)
  const [graduatesCount, setGraduatesCount] = useState(0)
  const [statsAnimated, setStatsAnimated] = useState(false)
  const statsSectionRef = useRef<HTMLElement | null>(null)
  const [syllabusOpen, setSyllabusOpen] = useState(false)
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<string>("")
  const [openModules, setOpenModules] = useState<number[]>([1])
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    question: "",
  })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactFeedback, setContactFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [newsletterForm, setNewsletterForm] = useState({
    name: "",
    email: "",
  })
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false)
  const [newsletterFeedback, setNewsletterFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const toggleModule = (moduleId: number) => {
    setOpenModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    )
  }

  const handleChapterClick = (chapterTitle: string) => {
    setSelectedChapter(chapterTitle)
    setChapterDialogOpen(true)
  }

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setContactSubmitting(true)
    setContactFeedback(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || "אירעה שגיאה בשליחה. נסי שוב.")
      }

      setContactFeedback({ type: "success", message: "השאלה נשלחה בהצלחה! נחזור אלייך בהקדם 💜" })
      setContactForm({ name: "", email: "", question: "" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "אירעה שגיאה בשליחה. נסי שוב."
      setContactFeedback({ type: "error", message })
    } finally {
      setContactSubmitting(false)
    }
  }

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNewsletterSubmitting(true)
    setNewsletterFeedback(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsletterForm),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || "אירעה שגיאה בהרשמה. נסי שוב.")
      }

      setNewsletterFeedback({ type: "success", message: "נרשמת בהצלחה לעדכונים 🎉" })
      setNewsletterForm({ name: "", email: "" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "אירעה שגיאה בהרשמה. נסי שוב."
      setNewsletterFeedback({ type: "error", message })
    } finally {
      setNewsletterSubmitting(false)
    }
  }

  useEffect(() => {
    if (statsAnimated) {
      return
    }

    const section = statsSectionRef.current
    if (!section) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry?.isIntersecting) {
          setStatsAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [statsAnimated])

  useEffect(() => {
    if (!statsAnimated) {
      return
    }

    const animateCounter = (target: number, setter: (val: number) => void, delay: number = 0) => {
      const duration = 2000
      const stepTime = 20
      const steps = duration / stepTime
      const increment = target / steps
      let current = 0
      
      const timeoutId = setTimeout(() => {
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setter(target)
            clearInterval(timer)
          } else {
            setter(Math.floor(current))
          }
        }, stepTime)
      }, delay)

      return timeoutId
    }
    
    const timeouts = [
      animateCounter(8, setModulesCount, 100),
      animateCounter(7, setProjectsCount, 200),
      animateCounter(120, setGraduatesCount, 300),
    ]

    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId))
    }
  }, [statsAnimated])

  return (
    <>
      {/* Header — outside main so overflow-x-hidden doesn't break fixed positioning */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="w-full bg-[linear-gradient(90deg,#18122b_0%,#321332_50%,#581c3e_100%)] shadow-[0_20px_60px_-24px_rgba(24,18,43,0.75)]">
          <div className="flex min-h-[110px] items-center justify-center px-4 py-4 text-center md:min-h-[140px] md:px-8">
            <div className="relative flex items-center justify-center gap-3 px-5 py-4 md:gap-5 md:px-8 md:py-5">
              <div className="pointer-events-none absolute inset-x-[-16%] inset-y-[-4%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.46)_0%,rgba(255,255,255,0.33)_22%,rgba(255,255,255,0.22)_42%,rgba(255,255,255,0.12)_62%,rgba(255,255,255,0.04)_82%,rgba(255,255,255,0)_100%)] blur-3xl" />
              <div className="flex flex-col items-center leading-tight text-white">
                <span className="translate-x-[0.6cm] text-2xl font-normal tracking-wide md:text-4xl">קורס AI</span>
              </div>
              <Image
                src="/AI_logo.png"
                alt="AI Course Logo"
                width={120}
                height={120}
                className="relative justify-self-center scale-[2.1] origin-center"
              />
              <span className="text-2xl font-normal tracking-[0.28em] text-white md:text-4xl">2026</span>
            </div>
          </div>
        </div>

        <nav className="mt-2 flex items-center justify-center gap-4 px-6 text-sm text-slate-700 md:gap-8 md:px-12 md:text-base lg:px-20">
          <Link href="#hero" className="font-medium transition-colors hover:text-[var(--header-right)]">בית</Link>
          <Link href="#for-who" className="font-medium transition-colors hover:text-[var(--header-right)]">למי מיועד</Link>
          <Link href="#outcomes" className="font-medium transition-colors hover:text-[var(--header-right)]">מה מקבלים</Link>
          <Link href="#how-delivered" className="font-medium transition-colors hover:text-[var(--header-right)]">מבנה הקורס</Link>
          <Link href="#content" className="font-medium transition-colors hover:text-[var(--header-right)]">תוכן הקורס</Link>
          <Link href="#about" className="font-medium transition-colors hover:text-[var(--header-right)]">אודות</Link>
          <Link href="#contact" className="font-medium transition-colors hover:text-[var(--header-right)]">צור קשר</Link>
        </nav>
      </header>

      <main className="relative min-h-screen overflow-x-hidden bg-white pt-[110px] md:pt-[140px]">
      <section
        id="hero"
        className="relative z-10 flex min-h-[calc(100vh-110px)] scroll-mt-[calc(8.75rem-1cm)] md:scroll-mt-[calc(11.75rem-1cm)] flex-col items-center justify-start bg-[url('/background.png')] bg-cover bg-top px-6 pt-[calc(2rem+1cm)] text-center md:min-h-[calc(100vh-140px)] md:pt-[calc(2.5rem+1cm)]"
      >

        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-border mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">קורס AI ממוקד תעשייה</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-foreground text-3xl md:text-5xl lg:text-6xl">מהבסיס. מהשטח. עד הפרקטיקה.</span>
            <br />
            <span className="gradient-text glow-text">Machine Learning</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            למד את הטכנולוגיה שמניעה את העתיד. מהיסודות ועד לפרויקטים אמיתיים,
            הקורס שלנו יכין אותך לקריירה בעולם ה-AI
          </p>

          {/* CTA Button */}
          <Link href="#overview">
            <Button
              size="lg"
              className="group relative overflow-hidden border-0 bg-[linear-gradient(90deg,#18122b_0%,#321332_50%,#581c3e_100%)] px-8 py-6 text-lg font-semibold text-white shadow-[0_18px_36px_-20px_rgba(24,18,43,0.85)] hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                התחל ללמוד עכשיו
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ───── Stats Section ───── */}
      <section id="overview" ref={statsSectionRef} className="relative z-10 scroll-mt-[calc(8.75rem-1cm)] px-6 py-20 md:scroll-mt-[calc(11.75rem-1cm)]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
            הקורס המקיף ביותר ל-Machine Learning בעברית.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
            מהיסודות ועד לפרויקטים אמיתיים — הכל בצורה ברורה, מסודרת ומעשית.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-16">
            מתאים לכל מי שרוצה להיכנס לעולם ה-AI ולהתקדם בקריירה.
          </p>

          <div className="flex flex-wrap justify-center gap-10 md:gap-20">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{modulesCount}</div>
              <div className="text-sm text-muted-foreground mt-2">מודולים</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{projectsCount}</div>
              <div className="text-sm text-muted-foreground mt-2">פרויקטים מעשיים</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text">{graduatesCount}</div>
              <div className="text-sm text-muted-foreground mt-2">בוגרות מרוצות</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── For Who Section ───── */}
      <section id="for-who" className="scroll-mt-[calc(8.75rem-1cm)] px-6 py-16 md:scroll-mt-[calc(11.75rem-1cm)]">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12 bg-[#581c3e]/25 backdrop-blur-md border border-[#7d2b60]/30">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">למי הקורס מיועד?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ["מפתחים", "שרוצים להוסיף AI לארגז הכלים שלהם"],
              ["אנשי דאטה", "שרוצים להעמיק בלמידת מכונה ומודלים"],
              ["סטודנטים", "שרוצים יתרון מעשי בשוק העבודה"],
              ["יזמים", "שרוצים להבין כיצד AI יכול לשדרג את המוצר שלהם"],
            ].map(([title, text]) => (
              <div key={title} className="gradient-border rounded-2xl p-6 hover:glow transition-shadow duration-500">
                <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Outcomes Section ───── */}
      <section id="outcomes" className="scroll-mt-[calc(8.75rem-1cm)] bg-secondary/20 bg-[url('/back_mind.png')] bg-no-repeat bg-right bg-contain px-6 py-16 md:scroll-mt-[calc(11.75rem-1cm)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">עם מה תצא מהקורס?</h2>

          <div className="space-y-3">
            {[
              "הבנה מעמיקה של אלגוריתמי למידת מכונה קלאסיים ומודרניים",
              "יכולת לבנות, לאמן ולהעריך מודלים בפייתון",
              "ניסיון מעשי עם פרויקטים מהעולם האמיתי",
              "הבנה של כיצד לבחור מודל נכון לפי הבעיה",
              "בסיס חזק להמשך ללמידה עמוקה ו-GenAI",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/15 bg-transparent p-4 backdrop-blur-[1px] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7d2b60]/60 hover:bg-[#581c3e]/35 hover:shadow-[0_10px_30px_-16px_rgba(88,28,62,0.9)]"
              >
                <div className="flex items-start gap-3 text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary drop-shadow-[0_0_8px_rgba(88,28,62,0.45)]" />
                  <span className="text-[1.05rem] font-semibold leading-8 tracking-[0.01em] drop-shadow-[0_1px_0_rgba(255,255,255,0.2)] md:text-[1.1rem]">
                    {item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How Course is Delivered Section ───── */}
      <section id="how-delivered" className="scroll-mt-[calc(8.75rem-1cm)] px-6 py-16 md:scroll-mt-[calc(11.75rem-1cm)]">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12 bg-[#581c3e]/25 backdrop-blur-md border border-[#7d2b60]/30">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">כיצד הקורס מועבר?</h2>

            <div className="space-y-6 text-lg leading-8 text-foreground">
              <p className="leading-relaxed">
                הקורס מועבר בצורה דיגיטלית באמצעות <span className="font-semibold text-primary">סרטוני לימוד מקצועיים, ברורים ומסודרים</span>, כך שניתן ללמוד בקצב אישי ובזמן שנוח לכם.
              </p>

              <div className="rounded-2xl border border-[#7d2b60]/40 bg-[#581c3e]/15 p-6">
                <h3 className="font-bold text-lg mb-3 text-primary">מה מקבלים לאחר ההרשמה:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span><span className="font-semibold">גישה מלאה לתכני הקורס למשך 3 שנים</span></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span><span className="font-semibold">אפשרות לחזור על החומר, לתרגל ולהעמיק</span> בכל נושא לאורך הדרך</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span><span className="font-semibold">ליווי אישי ומענה לשאלות</span> במהלך הלמידה</span>
                  </li>
                </ul>
              </div>

              <p className="leading-relaxed">
                כל זה מונגש כדי לאפשר <span className="font-semibold text-primary">הבנה אמיתית, התקדמות בטוחה וחוויית לימוד מקצועית ונעימה</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Course Content Section ───── */}
      <section id="content" className="scroll-mt-[calc(8.75rem-1cm)] px-6 py-16 md:scroll-mt-[calc(11.75rem-1cm)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
            <div className="flex-1">
              <Button
                asChild
                className="mb-5 animate-pulse bg-gradient-to-r from-[var(--gradient-purple)] via-[var(--gradient-blue)] to-[var(--gradient-pink)] text-white border-0 px-8 py-7 text-lg rounded-2xl shadow-[0_12px_32px_-12px_rgba(88,28,62,0.7)] hover:animate-none hover:scale-105 transition-transform duration-300"
              >
                <Link href="/preview">
                 לצפיה בסרטון לדוגמא
                  <Play className="w-6 h-6 mr-2" />
                </Link>
              </Button>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="gradient-text">Machine Learning</span>
                <br />
                <span className="text-foreground">תוכן הקורס המלא</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                כאן תמצאו את כל המודולים, הפרקים והפרויקטים של הקורס — מהבסיס ועד לפרקטיקה.
              </p>
            </div>

            <div className="gradient-border rounded-2xl p-6 w-full lg:w-80">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>מודולים</span>
                  <span className="text-foreground">8</span>
                </div>
                <div className="flex justify-between">
                  <span>פרקים</span>
                  <span className="text-foreground">45+</span>
                </div>
                <div className="flex justify-between">
                  <span>פרויקטים</span>
                  <span className="text-foreground">7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-8 md:p-12 bg-[#581c3e]/25 backdrop-blur-md border border-[#7d2b60]/30">
            <h3 className="text-2xl font-bold mb-8 text-foreground">תוכן הקורס</h3>

            <div className="space-y-4">
            {courseModules.map((module) => (
              <Collapsible
                key={module.id}
                open={openModules.includes(module.id)}
                onOpenChange={() => toggleModule(module.id)}
              >
                <div className="gradient-border rounded-2xl overflow-hidden">
                  <CollapsibleTrigger className="w-full p-5 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-purple)] to-[var(--gradient-blue)] flex items-center justify-center text-white font-bold">
                        {module.id}
                      </div>
                      <div className="text-right">
                        <h3 className="text-lg font-semibold text-foreground">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.chapters.length} פרקים</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                        openModules.includes(module.id) ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t border-border">
                      {module.chapters.map((chapter, index) => (
                        <button
                          key={index}
                          onClick={() => handleChapterClick(chapter.title)}
                          className="w-full px-5 py-4 flex items-center justify-start hover:bg-secondary/20 transition-colors border-b border-border/50 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                chapter.isProject
                                  ? "bg-gradient-to-br from-[var(--gradient-pink)] to-[var(--gradient-purple)]"
                                  : "bg-secondary"
                              }`}
                            >
                              {chapter.isProject ? (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              ) : (
                                <Play className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                chapter.isProject ? "text-primary font-medium" : "text-foreground"
                              }`}
                            >
                              {chapter.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}            </div>          </div>
        </div>
      </section>

      {/* ───── About Section ───── */}
      <section id="about" className="scroll-mt-[calc(8.75rem-1cm)] px-6 py-16 md:scroll-mt-[calc(11.75rem-1cm)]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-foreground tracking-normal">
              נעים להכיר, רחל שור
            </h2>

            <div className="space-y-6 text-xl leading-9 text-foreground font-semibold">
              <p>
                מהנדסת תוכנה ומרצה לתחומי הבינה המלאכותית, Machine Learning ו-Deep Learning, בעלת ניסיון בהוראה בסמינרים ובמכללות.
              </p>

              <p>
                בשנים האחרונות ליוויתי תלמידות רבות בלימוד עולמות ה-AI והפיתוח, מתוך שילוב של ידע מקצועי, הבנה עמוקה ויכולת להפוך נושאים מורכבים לברורים, מסודרים ומעשיים.
              </p>

              <p>
                לאורך הדרך עסקתי בפיתוח תוכנה, אלגוריתמים, עבודה עם דאטה ובניית תרגולים ונוטבוקים מקצועיים המבוססים על עבודה אמיתית מהשטח.
              </p>

              <p>
                הניסיון שצברתי לימד אותי שכדי להבין Machine Learning באמת, לא מספיק רק ללמוד קוד או תיאוריה — צריך להבין איך מודלים עובדים, איך מנתחים נתונים, ואיך בונים חשיבה נכונה לפתרון בעיות בצורה מקצועית.
              </p>

              <p>
                מתוך המקום הזה נבנה הקורס שלי — קורס מקצועי, מקיף ומעודכן, המלמד Machine Learning מהבסיס ועד לרמה מתקדמת, עם דגש על הבנה אמיתית, תרגול מעשי, עבודה עם דאטה אמיתי וחשיבה מקצועית כמו בתעשייה.
              </p>

              <p className="text-xl text-primary font-extrabold">
                אני מזמינה אותך להצטרף לעולם ה-AI וללמוד בצורה ברורה, מסודרת ומעשית.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA Section ───── */}
      <section className="py-16 px-6 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="gradient-border rounded-3xl p-8 md:p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">מוכנ/ה להתחיל?</h3>
            <p className="text-muted-foreground mb-6">השאר פרטים ונעדכן אותך ברגע שהקורס יהיה זמין!</p>
            <Button
              onClick={() => setSyllabusOpen(true)}
              className="bg-gradient-to-r from-[var(--gradient-purple)] via-[var(--gradient-blue)] to-[var(--gradient-pink)] text-white border-0 px-8 py-6 rounded-2xl text-base"
            >
              צרפי אותי לרשימת הראשונים
              <FileText className="w-5 h-5 mr-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ───── Contact Details + Question Form Section ───── */}
      <section id="contact" className="scroll-mt-[calc(8.75rem-1cm)] px-6 py-16 md:scroll-mt-[calc(11.75rem-1cm)]">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12 bg-[#581c3e]/25 backdrop-blur-md border border-[#7d2b60]/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-5">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground"> אנחנו כאן ✨</h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  לכל שאלה על הקורס, התאמה אישית או ייעוץ לפני הרשמה — אני כאן בשבילך.
                </p>

                <div className="space-y-4">
                  <a
                    href={contactMailtoHref}
                    aria-label="שליחת מייל לרחל שור"
                    title="לחצי לפתיחת הודעת מייל חדשה"
                    className="block gradient-border rounded-2xl p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <p className="text-xs text-muted-foreground mb-1">מייל</p>
                    <p className="text-foreground font-semibold break-all">{contactEmailAddress}</p>
                  </a>

                  <a
                    href="tel:0556781514"
                    className="block gradient-border rounded-2xl p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <p className="text-xs text-muted-foreground mb-1">טלפון</p>
                    <p className="text-foreground font-semibold">055-678-1514</p>
                  </a>
                </div>
              </div>

              <div className="gradient-border rounded-2xl p-5 md:p-6">
                <h4 className="text-xl font-bold text-foreground mb-4">טופס לכל שאלה</h4>
                <form className="space-y-3" onSubmit={handleContactSubmit}>
                  <input
                    type="text"
                    placeholder="שם מלא"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                  <input
                    type="email"
                    placeholder="מייל"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                  <textarea
                    placeholder="השאלה שלך"
                    rows={5}
                    value={contactForm.question}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, question: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--gradient-purple)] to-[var(--gradient-pink)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {contactSubmitting ? "שולח..." : "שלחי שאלה"}
                  </button>
                  {contactFeedback && (
                    <p
                      className={`text-sm ${
                        contactFeedback.type === "success" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {contactFeedback.message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="relative z-10 py-16 px-6 border-t border-border bg-[#581c3e]/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {/* Left: Logo and About */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Image src="/AI_logo.png" alt="AI Course Logo" width={120} height={120} className="rounded-xl" />
                <div>
                  <div className="text-lg font-bold text-foreground">AI Academy</div>
                  <div className="text-xs text-foreground/80">2026</div>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed max-w-xs">
                קורסים מקצועיים בבינה מלאכותית ולמידת מכונה. המקום שלך ללמוד, לגדול ולהתקדם.
              </p>
            </div>

            {/* Middle: Footer Navigation */}
            <div className="flex flex-col gap-4 md:items-center">
              <h3 className="text-xl font-bold text-foreground">קישורים מהירים</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-foreground/80 md:grid-cols-1 md:text-center">
                <Link href="#hero" className="transition-colors hover:text-foreground">בית</Link>
                <Link href="#overview" className="transition-colors hover:text-foreground">הקורס</Link>
                <Link href="#for-who" className="transition-colors hover:text-foreground">למי מיועד</Link>
                <Link href="#outcomes" className="transition-colors hover:text-foreground">מה מקבלים</Link>
                <Link href="#content" className="transition-colors hover:text-foreground">תוכן הקורס</Link>
                <Link href="#about" className="transition-colors hover:text-foreground">אודות</Link>
                <Link href="#contact" className="transition-colors hover:text-foreground">צור קשר</Link>
              </div>
            </div>

            {/* Right: Newsletter Signup */}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">קבל עדכונים והטבות</h3>
                <p className="text-base md:text-lg text-foreground/80 mb-5">הרשם לעדכונים על קורסים חדשים והטבות בעבוד</p>
              </div>
              <form className="flex flex-col gap-2" onSubmit={handleNewsletterSubmit}>
                <input
                  type="text"
                  placeholder="שמך"
                  value={newsletterForm.name}
                  onChange={(e) => setNewsletterForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="דוא״ל אלקטרוני"
                  value={newsletterForm.email}
                  onChange={(e) => setNewsletterForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterSubmitting}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--gradient-purple)] to-[var(--gradient-pink)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {newsletterSubmitting ? "נרשמת..." : "הרשם"}
                </button>
                {newsletterFeedback && (
                  <p
                    className={`text-sm ${
                      newsletterFeedback.type === "success" ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {newsletterFeedback.message}
                  </p>
                )}
              </form>
            </div>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <UpdatePopup />
      <SyllabusModal open={syllabusOpen} onOpenChange={setSyllabusOpen} />

      <Dialog open={chapterDialogOpen} onOpenChange={setChapterDialogOpen}>
        <DialogContent className="gradient-border bg-card text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Lock className="w-6 h-6 text-primary" />
              <span>הקורס בתהליך בניה</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-4 leading-relaxed">
              הפרק <span className="text-primary font-medium">{`"${selectedChapter}"`}</span> נמצא כרגע בתהליך יצירה.
              <br />
              <br />
              השאירו פרטים לקבלת הסילבוס ונעדכן אתכם ברגע שהקורס יהיה זמין!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button
              onClick={() => {
                setChapterDialogOpen(false)
                setSyllabusOpen(true)
              }}
              className="w-full bg-gradient-to-r from-[var(--gradient-purple)] via-[var(--gradient-blue)] to-[var(--gradient-pink)] text-white border-0"
            >
              קבל סילבוס ועדכונים
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
    </>
  )
}
  