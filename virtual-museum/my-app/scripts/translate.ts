/**
 * Translates public/messages/en.json into other locales using the DeepL API.
 *
 * Usage:
 *   DEEPL_API_KEY=your_key npx ts-node --project tsconfig.json scripts/translate.ts
 *   (or add a "translate" script to package.json)
 *
 * Outputs one file per locale in public/messages/.
 * Get a free key at: https://www.deepl.com/pro#developer
 */

import fs from 'fs'
import path from 'path'

const API_KEY = process.env.DEEPL_API_KEY
if (!API_KEY) {
  console.error('Error: DEEPL_API_KEY environment variable is not set.')
  process.exit(1)
}

// DeepL free accounts use api-free.deepl.com; pro accounts use api.deepl.com
const DEEPL_URL = 'https://api-free.deepl.com/v2/translate'

const TARGET_LOCALES: { code: string; deeplCode: string }[] = [
  { code: 'fr', deeplCode: 'FR' },
  { code: 'es', deeplCode: 'ES' },
  { code: 'de', deeplCode: 'DE' },
  { code: 'it', deeplCode: 'IT' },
  { code: 'pt', deeplCode: 'PT' },
]

const MESSAGES_DIR = path.join(__dirname, '..', 'public', 'messages')
const SOURCE_FILE = path.join(MESSAGES_DIR, 'en.json')

async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  const body = {
    text: texts,
    source_lang: 'EN',
    target_lang: targetLang,
  }

  const res = await fetch(DEEPL_URL, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DeepL API error ${res.status}: ${err}`)
  }

  const data = await res.json() as { translations: { text: string }[] }
  return data.translations.map((t) => t.text)
}

async function translateLocale(
  source: Record<string, string>,
  targetCode: string,
  deeplCode: string
): Promise<void> {
  const keys = Object.keys(source)
  const values = Object.values(source)

  // DeepL allows up to 50 texts per request
  const BATCH_SIZE = 45
  const translated: string[] = []

  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    const batch = values.slice(i, i + BATCH_SIZE)
    console.log(`  Translating batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} strings)...`)
    const results = await translateBatch(batch, deeplCode)
    translated.push(...results)
  }

  const result: Record<string, string> = {}
  keys.forEach((key, i) => {
    result[key] = translated[i]
  })

  const outFile = path.join(MESSAGES_DIR, `${targetCode}.json`)
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n', 'utf-8')
  console.log(`  Written: ${outFile}`)
}

async function main() {
  const source: Record<string, string> = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf-8'))
  console.log(`Source: ${Object.keys(source).length} strings from en.json\n`)

  for (const { code, deeplCode } of TARGET_LOCALES) {
    console.log(`Translating → ${code} (${deeplCode})...`)
    await translateLocale(source, code, deeplCode)
    console.log(`Done: ${code}\n`)
  }

  console.log('All translations complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
