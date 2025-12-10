import { google } from 'googleapis'
import key from './service_account.json'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: key.client_email,
    private_key: key.private_key
  },
  scopes: ['https://www.googleapis.com/auth/indexing', 'https://www.googleapis.com/auth/webmasters.readonly']
})

async function getSitemapUrls(sitemapUrl: string): Promise<string[]> {
  try {
    console.log(`Fetching sitemap from: ${sitemapUrl}`)
    const response = await fetch(sitemapUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.statusText}`)
    }
    const xmlText = await response.text()

    // Simple regex to extract URLs from <loc> tags
    const urls: string[] = []
    const regex = /<loc>(.*?)<\/loc>/g
    let match
    while ((match = regex.exec(xmlText)) !== null) {
      urls.push(match[1])
    }
    console.log(`Found ${urls.length} URLs in sitemap.`)
    return urls
  } catch (error: any) {
    console.error('Error parsing sitemap:', error.message)
    return []
  }
}

// Helper to check if URL is already indexed
async function checkUrlStatus(url: string, authClient: any): Promise<boolean> {
  const searchconsole = google.searchconsole({ version: 'v1', auth: authClient })
  try {
    console.log(`Checking status: ${url}`)
    const res = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: url,
        siteUrl: 'sc-domain:ahnafnafee.dev',
        languageCode: 'en-US'
      }
    })
    const coverageState = res.data.inspectionResult?.indexStatusResult?.coverageState
    console.log(`  -> Coverage State: ${coverageState}`)
    return coverageState === 'SubmittedAndIndexed' || coverageState === 'Indexed'
  } catch (error: any) {
    console.error(`  -> Failed to check status: ${error.message}`)
    // If check fails (e.g. permission error), assume not indexed and try to submit
    return false
  }
}

// Random shuffle helper
function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function batchIndex() {
  try {
    const client = await auth.getClient()
    console.log('✅ Authenticated with Google.')

    let allUrls = await getSitemapUrls('https://www.ahnafnafee.dev/sitemap.xml')
    if (allUrls.length === 0) {
      console.log('No URLs found to index.')
      return
    }

    // Daily quota is usually 200 for Indexing API
    // We shuffle to give every page a chance over time
    allUrls = shuffleArray(allUrls)
    const urlsToProcess = allUrls.slice(0, 200)

    console.log(`Processing ${urlsToProcess.length} URLs (Random Batch of 200)...`)

    const indexing = google.indexing({ version: 'v3', auth })

    for (const url of urlsToProcess) {
      const isIndexed = await checkUrlStatus(url, client)

      if (!isIndexed) {
        try {
          const result = await indexing.urlNotifications.publish({
            requestBody: {
              url: url,
              type: 'URL_UPDATED'
            }
          })
          console.log(`🚀 Indexed: ${url} | Status: ${result.status}`)
        } catch (error: any) {
          console.error(`❌ Error on ${url}:`, error.message)
          if (error.code === 403) {
            console.error("  -> Ensure 'Indexing API' is enabled & Service Account has permissions.")
          }
        }
        // Rate limiting (avoid hitting quotas too fast)
        await delay(1500)
      } else {
        console.log(`✨ Already Indexed: ${url}`)
      }
    }
    console.log('✅ Batch indexing complete.')
  } catch (error: any) {
    console.error('Authentication failed:', error.message)
  }
}

batchIndex()
