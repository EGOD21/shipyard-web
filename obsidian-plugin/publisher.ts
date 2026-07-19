import { Notice, parseYaml } from 'obsidian'
import * as fs from 'fs/promises'
import * as path from 'path'
import type { ShipyardSettings } from './settings'
import type { GitManager } from './git'

export class Publisher {
  private settings: ShipyardSettings
  private gitManager: GitManager

  constructor(settings: ShipyardSettings, gitManager: GitManager) {
    this.settings = settings
    this.gitManager = gitManager
  }

  async processFile(filePath: string): Promise<void> {
    try {
      // Read file content
      const content = await fs.readFile(filePath, 'utf8')

      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (!frontmatterMatch) {
        console.log('No frontmatter found, skipping:', filePath)
        return
      }

      const frontmatter = parseYaml(frontmatterMatch[1])

      // Check if published
      if (frontmatter.published === true) {
        await this.copyToRepo(filePath, frontmatter)
      } else if (frontmatter.published === false) {
        await this.removeFromRepo(filePath)
      }
    } catch (error) {
      console.error('Error processing file:', error)
      new Notice('Error: Failed to process file. Check console for details.')
    }
  }

  private async copyToRepo(sourceFile: string, frontmatter: any): Promise<void> {
    if (!this.settings.repoPath) {
      new Notice('Error: Repository path not configured')
      return
    }

    const fileName = path.basename(sourceFile)
    const contentType = frontmatter.type || 'essays'

    // Ensure type is valid
    const validTypes = ['essays', 'notes', 'creative']
    const targetType = validTypes.includes(contentType) ? contentType : 'essays'

    const targetDir = path.join(this.settings.repoPath, 'content', targetType)
    const targetFile = path.join(targetDir, fileName)

    try {
      // Create target directory if it doesn't exist
      await fs.mkdir(targetDir, { recursive: true })

      // Copy file
      await fs.copyFile(sourceFile, targetFile)

      console.log(`Copied to: ${targetFile}`)
    } catch (error) {
      console.error('Error copying file:', error)
      throw error
    }
  }

  private async removeFromRepo(sourceFile: string): Promise<void> {
    if (!this.settings.repoPath) {
      return
    }

    const fileName = path.basename(sourceFile)
    const categories = ['essays', 'notes', 'creative']

    for (const category of categories) {
      const targetFile = path.join(this.settings.repoPath, 'content', category, fileName)

      try {
        await fs.access(targetFile)
        await fs.unlink(targetFile)
        console.log(`Removed: ${targetFile}`)
        return
      } catch (error) {
        // File doesn't exist in this category, try next
        continue
      }
    }

    console.log('File not found in repo, nothing to remove')
  }
}
