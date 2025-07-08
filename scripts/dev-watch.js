#!/usr/bin/env node

import { execSync } from 'child_process'
import { watch } from 'fs'
import { join } from 'path'

console.log('🚀 Starting dev mode with auto-push to dev sheet...')
console.log('📁 Watching for changes in src/ directory...')
console.log('🔄 Auto-pushing to dev sheet on file changes...')

// Initial push
try {
  console.log('📤 Initial push to dev sheet...')
  execSync('yarn push:dev', { stdio: 'inherit' })
  console.log('✅ Initial push complete!')
} catch (error) {
  console.error('❌ Initial push failed:', error.message)
}

// Watch for changes
const srcDir = join(process.cwd(), 'src')
let isPushing = false

watch(srcDir, { recursive: true }, (eventType, filename) => {
  if (isPushing) {
    console.log('⏳ Push already in progress, skipping...')
    return
  }

  if (filename && !filename.includes('.DS_Store') && !filename.includes('~')) {
    console.log(`📝 File changed: ${filename}`)

    isPushing = true

    try {
      console.log('📤 Pushing to dev sheet...')
      execSync('yarn push:dev', { stdio: 'inherit' })
      console.log('✅ Push complete!')
    } catch (error) {
      console.error('❌ Push failed:', error.message)
    } finally {
      isPushing = false
    }
  }
})

console.log('👀 Watching for changes... (Press Ctrl+C to stop)') 