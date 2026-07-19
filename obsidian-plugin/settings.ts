import { App, PluginSettingTab, Setting } from 'obsidian'
import type ShipyardPublisher from './main'

export interface ShipyardSettings {
  repoPath: string
  autoCommit: boolean
  commitTemplate: string
  debounceDelay: number
  githubPAT: string
}

export const DEFAULT_SETTINGS: ShipyardSettings = {
  repoPath: '',
  autoCommit: true,
  commitTemplate: 'Update: {filename}',
  debounceDelay: 3000,
  githubPAT: '',
}

export class ShipyardSettingTab extends PluginSettingTab {
  plugin: ShipyardPublisher

  constructor(app: App, plugin: ShipyardPublisher) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()
    containerEl.createEl('h2', { text: 'Shipyard Publisher Settings' })

    new Setting(containerEl)
      .setName('Next.js repository path')
      .setDesc('Absolute path to your shipyard-web repository (e.g., /Users/you/shipyard-web)')
      .addText((text) =>
        text
          .setPlaceholder('/path/to/shipyard-web')
          .setValue(this.plugin.settings.repoPath)
          .onChange(async (value) => {
            this.plugin.settings.repoPath = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName('Auto-commit')
      .setDesc('Automatically commit and push changes to Git')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoCommit)
          .onChange(async (value) => {
            this.plugin.settings.autoCommit = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName('Commit message template')
      .setDesc('Template for commit messages. Use {filename} as placeholder.')
      .addText((text) =>
        text
          .setPlaceholder('Update: {filename}')
          .setValue(this.plugin.settings.commitTemplate)
          .onChange(async (value) => {
            this.plugin.settings.commitTemplate = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName('Debounce delay (ms)')
      .setDesc('Wait time after file save before processing (minimum 3000ms)')
      .addText((text) =>
        text
          .setPlaceholder('3000')
          .setValue(String(this.plugin.settings.debounceDelay))
          .onChange(async (value) => {
            const delay = parseInt(value)
            if (!isNaN(delay) && delay >= 3000) {
              this.plugin.settings.debounceDelay = delay
              await this.plugin.saveSettings()
            }
          })
      )

    new Setting(containerEl)
      .setName('GitHub Personal Access Token')
      .setDesc('GitHub PAT for pushing changes. Create one at github.com/settings/tokens with "repo" scope.')
      .addText((text) => {
        text
          .setPlaceholder('ghp_xxxxxxxxxxxxxxxxxxxx')
          .setValue(this.plugin.settings.githubPAT)
          .onChange(async (value) => {
            this.plugin.settings.githubPAT = value
            await this.plugin.saveSettings()
          })
        text.inputEl.type = 'password'
        return text
      })
  }
}
