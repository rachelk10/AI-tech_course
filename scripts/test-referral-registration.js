const fs = require('fs').promises
const path = require('path')

async function run() {
  const referrersPath = path.join(process.cwd(), 'data', 'referrers.json')
  let referrers = []
  try {
    const raw = await fs.readFile(referrersPath, 'utf8')
    referrers = JSON.parse(raw)
  } catch (e) {
    console.error('Could not read referrers.json:', e.message)
    process.exit(1)
  }

  const code = process.argv[2] || 'EXAMPLE01'
  const found = referrers.find(r => String(r.referralCode ?? r.id).toUpperCase() === code.toUpperCase())
  if (!found) {
    console.error('Referral code not found in data/referrers.json:', code)
    process.exit(2)
  }

  console.log('Before:', found.referralCode || found.id, 'count =', Number(found.count || 0))
  found.count = (Number(found.count || 0) + 1)
  await fs.writeFile(referrersPath, JSON.stringify(referrers, null, 2), 'utf8')
  console.log('After: ', found.referralCode || found.id, 'count =', found.count)
}

run().catch(err => {
  console.error(err)
  process.exit(99)
})
