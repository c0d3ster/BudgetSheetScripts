#!/usr/bin/env node

/* eslint-env node */

import { execSync } from 'child_process'
import { watch } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

console.log('🚀 Starting dev mode with auto-push to dev sheet...')
console.log('📁 Watching for changes in src/ directory...')
console.log('⏱️  Debounced pushing (30 second delay)...')
console.log('💡 Press Enter to push immediately')

// Configuration
const DEBOUNCE_DELAY = 30000 // 30 seconds

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
    console.log(`⏰ Auto-push scheduled in ${DEBOUNCE_DELAY / 1000} seconds (press Enter to push now)`)
    console.log('') // Add spacing after the timer line
  }
}

// Manual push trigger
const triggerManualPush = () => {
  if (pendingChanges.size > 0) {
    console.log('🚀 Manual push triggered!')
    if (pushTimeout) {
      clearTimeout(pushTimeout)
      pushTimeout = null
    }
    debouncedPush()
  } else {
    console.log('📝 No pending changes to push')
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

// Set up manual push trigger
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.on('line', () => {
  triggerManualPush()
})

console.log('👀 Watching for changes... (Press Ctrl+C to stop)')
console.log('💡 Changes will be batched and pushed after 30 seconds of inactivity')
console.log('💡 Press Enter to push immediately')
console.log('') // Add spacing after the timer line
