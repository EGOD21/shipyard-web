import { Plugin, TFile } from 'obsidian'
import { ShipyardSettings, DEFAULT_SETTINGS, ShipyardSettingTab } from './settings'
import { GitManager } from './git'
import { Publisher } from './publisher'

export default class ShipyardPublisher extends Plugin {
  settings: ShipyardSettings
  gitManager: GitManager | null = null
  publisher: Publisher | null = null
  debounceTimers: Map<string, NodeJS.Timeout> = new Map()

  async onload() {
    await this.loadSettings()

    // Initialize Git manager and publisher if repo path is configured
    if (this.settings.repoPath) {
      this.initializeManagers()
    }

    // Register file modification handler
    this.registerEvent(
      this.app.vault.on('modify', (file) => {
        if (file instanceof TFile && file.extension === 'md') {
          this.handleFileChange(file)
        }
      })
    )

    // Add command to insert frontmatter template
    this.addCommand({
      id: 'insert-shipyard-frontmatter',
      name: 'Insert Shipyard frontmatter',
      editorCallback: (editor) => {
        const today = new Date().toISOString().split('T')[0]
        const template = `---
published: false
dg-home: false
title: ""
date: "${today}"
type: essay
excerpt: ""
tags: []
---

`
        // Insert at beginning of document for proper properties UI
        editor.setCursor(0, 0)
        editor.replaceRange(template, { line: 0, ch: 0 })
        // Move cursor to title value
        editor.setCursor({ line: 3, ch: 8 })
      }
    })

    // Add settings tab
    this.addSettingTab(new ShipyardSettingTab(this.app, this))

    console.log('Shipyard Publisher loaded')
  }

  onunload() {
    console.log('Shipyard Publisher unloaded')
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)

    // Reinitialize managers when settings change
    if (this.settings.repoPath) {
      this.initializeManagers()
    }
  }

  initializeManagers() {
    this.gitManager = new GitManager(this.settings.repoPath, this.settings.githubPAT)
    this.publisher = new Publisher(this.settings, this.gitManager)
  }

  handleFileChange(file: TFile) {
    // Clear existing timer for this file
    const existingTimer = this.debounceTimers.get(file.path)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    // Set new debounced timer
    const timer = setTimeout(() => {
      this.processFileChange(file)
      this.debounceTimers.delete(file.path)
    }, this.settings.debounceDelay)

    this.debounceTimers.set(file.path, timer)
  }

  async processFileChange(file: TFile) {
    if (!this.publisher || !this.gitManager) {
      console.log('Publisher not initialized (repo path not configured)')
      return
    }

    console.log(`Processing file: ${file.path}`)

    const filePath = (this.app.vault.adapter as any).getFullPath(file.path)

    try {
      // Process file (copy or remove)
      await this.publisher.processFile(filePath)

      // Commit and push if auto-commit enabled
      if (this.settings.autoCommit) {
        const commitMessage = this.settings.commitTemplate.replace('{filename}', file.basename)
        await this.gitManager.commitAndPush(commitMessage)
      }
    } catch (error) {
      console.error('Error processing file change:', error)
    }
  }
}
