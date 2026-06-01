// סקריפט עזר לעדכון סטטוס תשלום של משתמשים
// הרץ: npx ts-node scripts/update-user-payment.ts user@example.com

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateUserPayment(email: string, hasPaid: boolean = true) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { hasPaid },
    })
    
    console.log(`✅ עודכן בהצלחה:`)
    console.log(`   מייל: ${user.email}`)
    console.log(`   שם: ${user.name || 'לא הוזן'}`)
    console.log(`   סטטוס תשלום: ${user.hasPaid ? 'שילם' : 'לא שילם'}`)
  } catch (error) {
    console.error('❌ שגיאה:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// קבל מייל מ-command line
const email = process.argv[2]
const hasPaid = process.argv[3] !== 'false'

if (!email) {
  console.log('שימוש: npx ts-node scripts/update-user-payment.ts EMAIL [true/false]')
  console.log('דוגמה: npx ts-node scripts/update-user-payment.ts user@example.com true')
  process.exit(1)
}

updateUserPayment(email, hasPaid)
