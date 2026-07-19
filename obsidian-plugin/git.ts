import simpleGit, { SimpleGit } from 'simple-git'
import { Notice } from 'obsidian'

export class GitManager {
  private git: SimpleGit
  private repoPath: string

  constructor(repoPath: string) {
    this.repoPath = repoPath
    this.git = simpleGit(repoPath)
  }

  async isRepoValid(): Promise<boolean> {
    try {
      const isRepo = await this.git.checkIsRepo()
      return isRepo
    } catch (error) {
      console.error('Git repo check failed:', error)
      return false
    }
  }

  async commitAndPush(message: string): Promise<void> {
    try {
      // Check if repo is valid
      const valid = await this.isRepoValid()
      if (!valid) {
        new Notice('Error: Invalid Git repository path')
        throw new Error('Invalid Git repository')
      }

      // Add all changes in content directory
      await this.git.add('content/*')

      // Check if there are changes to commit
      const status = await this.git.status()
      if (status.files.length === 0) {
        console.log('No changes to commit')
        return
      }

      // Commit
      await this.git.commit(message)

      // Push with timeout
      await Promise.race([
        this.git.push(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Push timeout')), 30000)
        ),
      ])

      new Notice('Published to Shipyard ✓')
    } catch (error) {
      console.error('Git operation failed:', error)

      // Retry once
      try {
        console.log('Retrying push...')
        await this.git.push()
        new Notice('Published to Shipyard ✓')
      } catch (retryError) {
        new Notice('Error: Failed to push to Git. Check console for details.')
        throw retryError
      }
    }
  }
}
