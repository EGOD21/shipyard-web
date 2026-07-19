# Shipyard Publisher — Obsidian Plugin

Automatically publish notes to The Shipyard writing site.

## Installation

### Development Installation

1. Build the plugin:
   ```bash
   cd obsidian-plugin
   npm install
   npm run build
   ```

2. Copy plugin to Obsidian vault:
   ```bash
   mkdir -p /path/to/your/vault/.obsidian/plugins/shipyard-publisher
   cp main.js manifest.json /path/to/your/vault/.obsidian/plugins/shipyard-publisher/
   ```

3. Enable plugin in Obsidian:
   - Open Obsidian
   - Settings → Community plugins → Installed plugins
   - Enable "Shipyard Publisher"

## Configuration

1. Open plugin settings (Settings → Shipyard Publisher)

2. Set repository path:
   - Enter absolute path to your shipyard-web repository
   - Example: `/Users/you/Developer/shipyard-web`

3. Configure options:
   - **Auto-commit**: Enable/disable automatic Git commits (default: on)
   - **Commit message template**: Customize commit messages (use `{filename}` as placeholder)
   - **Debounce delay**: Wait time after save before processing (minimum 3000ms)

## Usage

1. Write a note in Obsidian

2. Add frontmatter:
   ```yaml
   ---
   published: true
   title: "Your Title"
   date: 2026-07-19
   type: essay  # essay | note | creative
   ---
   ```

3. Save the file

4. Plugin will:
   - Wait 3 seconds (debounce)
   - Copy file to `content/[type]/` in Next.js repo
   - Commit and push to Git (if auto-commit enabled)
   - Show notification when published

## Unpublishing

Change `published: true` to `published: false`, save, and the file will be removed from the site.

## Troubleshooting

### Plugin not working
- Check console (Cmd+Option+I) for errors
- Verify repository path is correct and is a Git repo
- Ensure you have Git installed and configured

### Git push fails
- Check Git credentials are configured
- Verify you have push access to the repository
- Check network connection

### Files not appearing on site
- Verify Vercel deployment is working
- Check file was copied to correct directory in repo
- Ensure frontmatter is valid YAML

## Development

Watch mode for development:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```
