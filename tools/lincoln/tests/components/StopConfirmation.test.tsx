import { render } from 'ink-testing-library'
import React from 'react'
import { describe, expect, test, vi } from 'vitest'
import { StopConfirmation } from '../../src/components/StopConfirmation'

async function tick() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

describe('StopConfirmation', () => {
  test('renders command and workspace', () => {
    const { lastFrame } = render(
      <StopConfirmation
        sessionId="2026-06-28-test"
        workspaceRoot="/workspace"
        onConfirm={vi.fn()}
      />,
    )

    expect(lastFrame()).toContain('Stopped')
    expect(lastFrame()).toContain('Session 2026-06-28-test saved.')
    expect(lastFrame()).toContain('Workspace: /workspace')
    expect(lastFrame()).toContain('claude process-interview 2026-06-28-test')
  })

  test('calls onConfirm when any key is pressed', async () => {
    const onConfirm = vi.fn()
    const { stdin } = render(
      <StopConfirmation sessionId="2026-06-28-test" onConfirm={onConfirm} />,
    )

    await tick()
    stdin.write('y')
    await tick()

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
