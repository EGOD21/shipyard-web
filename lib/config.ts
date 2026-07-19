import fs from 'fs'
import path from 'path'

export interface SiteConfig {
  backgroundMediaUrl: string
}

export function getSiteConfig(): SiteConfig {
  const configPath = path.join(process.cwd(), 'config', 'site.json')

  try {
    const configFile = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(configFile)
  } catch (error) {
    // Return defaults if config doesn't exist
    return {
      backgroundMediaUrl: '',
    }
  }
}
