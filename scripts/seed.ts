import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('מתחיל להזריע נתונים...')

  // משתמש דמה שלא שילם
  const freeUser = await prisma.user.upsert({
    where: { email: 'free@example.com' },
    update: {},
    create: {
      email: 'free@example.com',
      name: 'משתמש חינם',
      password: await bcrypt.hash('password123', 10),
      hasPaid: false,
    },
  })

  console.log('✅ נוצר משתמש חינם:', freeUser.email)

  // משתמש דמה ששילם
  const paidUser = await prisma.user.upsert({
    where: { email: 'paid@example.com' },
    update: {},
    create: {
      email: 'paid@example.com',
      name: 'משתמש בתשלום',
      password: await bcrypt.hash('password123', 10),
      hasPaid: true,
    },
  })

  console.log('✅ נוצר משתמש בתשלום:', paidUser.email)

  console.log('\n📋 פרטי כניסה לדוגמה:')
  console.log('משתמש ללא תשלום:')
  console.log('  מייל: free@example.com')
  console.log('  סיסמה: password123')
  console.log('')
  console.log('משתמש ששילם:')
  console.log('  מייל: paid@example.com')
  console.log('  סיסמה: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
