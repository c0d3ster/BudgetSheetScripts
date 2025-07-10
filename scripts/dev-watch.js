#!/usr/bin/env node

/* eslint-env node */

import { execSync } from 'child_process'
import { watch } from 'fs'
import { join } from 'path'

console.log('🚀 Starting dev mode with auto-push to dev sheet...')
console.log('📁 Watching for changes in src/ directory...')
console.log('⏱️  Debounced pushing (2 second delay)...')

// Configuration
const DEBOUNCE_DELAY = 2000 // 2 seconds

let pushTimeout = null
let isPushing = false
let pendingChanges = new Set()
let lastPushTime = 0

// Debounced push function
const debouncedPush = () => {
  if (isPushing) {
    console.log('⏳ Push already in progress, will retry after current push...')
    return
  }

  const now = Date.now()
  const timeSinceLastPush = now - lastPushTime

  // Don't push if we just pushed recently (within 1 second)
  if (timeSinceLastPush < 1000) {
    console.log('⏸️  Skipping push - too soon after last push')
    return
  }

  if (pendingChanges.size === 0) {
    console.log('📝 No pending changes to push')
    return
  }

  isPushing = true
  const changes = Array.from(pendingChanges)
  pendingChanges.clear()

  console.log(`📤 Pushing ${changes.length} file changes to dev sheet...`)
  console.log(`📄 Changed files: ${changes.join(', ')}`)

  try {
    execSync('yarn push:dev', { stdio: 'inherit' })
    console.log('✅ Push complete!')
    lastPushTime = Date.now()
  } catch (error) {
    console.error('❌ Push failed:', error.message)
    // Re-add failed changes to pending
    changes.forEach(change => pendingChanges.add(change))
  } finally {
    isPushing = false

    // If there are still pending changes, schedule another push
    if (pendingChanges.size > 0) {
      console.log(`⏰ Scheduling push for remaining ${pendingChanges.size} changes...`)
      pushTimeout = setTimeout(debouncedPush, DEBOUNCE_DELAY)
    }
  }
}

// Schedule a push with debouncing
const schedulePush = filename => {
  const wasAlreadyPending = pendingChanges.has(filename)
  pendingChanges.add(filename)

  // Clear existing timeout
  if (pushTimeout) {
    clearTimeout(pushTimeout)
  }

  // Schedule new push
  pushTimeout = setTimeout(debouncedPush, DEBOUNCE_DELAY)

  // Only log if this is a new change
  if (!wasAlreadyPending) {
    console.log(`📝 File changed: ${filename} (${pendingChanges.size} pending changes)`)
  }
}

// Initial push
try {
  console.log('📤 Initial push to dev sheet...')
  execSync('yarn push:dev', { stdio: 'inherit' })
  console.log('✅ Initial push complete!')
  lastPushTime = Date.now()
} catch (error) {
  console.error('❌ Initial push failed:', error.message)
}

// Watch for changes
const srcDir = join(process.cwd(), 'src')

watch(srcDir, { recursive: true }, (eventType, filename) => {
  if (filename && !filename.includes('.DS_Store') && !filename.includes('~') && !filename.includes('.tmp')) {
    schedulePush(filename)
  }
})

console.log('👀 Watching for changes... (Press Ctrl+C to stop)')
console.log('💡 Changes will be batched and pushed after 2 seconds of inactivity')
