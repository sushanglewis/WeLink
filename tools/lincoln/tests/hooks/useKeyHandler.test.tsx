import { Text } from 'ink'
import { render } from 'ink-testing-library'
import React, { useState } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { useKeyHandler } from '../../src/hooks/useKeyHandler'

interface TestComponentProps {
  onStop: () => void
  onCancel: () => void
  onUp?: () => void
  onDown?: () => void
}

function TestComponent({ onStop, onCancel, onUp, onDown }: TestComponentProps) {
  useKeyHandler({ onStop, onCancel, onUp, onDown })
  const [count, setCount] = useState(0)
  return <Text onClick={() => setCount(c => c + 1)}>{count}</Text>
}

async function tick() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

describe('useKeyHandler', () => {
  test('calls onStop when Enter is pressed', async () => {
    const onStop = vi.fn()
    const onCancel = vi.fn()
    const { stdin } = render(
      <TestComponent onStop={onStop} onCancel={onCancel} />,
    )

    await tick()
    stdin.write('\r')
    await tick()

    expect(onStop).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  test('calls onCancel when q is pressed', async () => {
    const onStop = vi.fn()
    const onCancel = vi.fn()
    const { stdin } = render(
      <TestComponent onStop={onStop} onCancel={onCancel} />,
    )

    await tick()
    stdin.write('q')
    await tick()

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onStop).not.toHaveBeenCalled()
  })

  test('calls onCancel when Escape is pressed', async () => {
    const onStop = vi.fn()
    const onCancel = vi.fn()
    const { stdin } = render(
      <TestComponent onStop={onStop} onCancel={onCancel} />,
    )

    await tick()
    stdin.write('')
    await tick()

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onStop).not.toHaveBeenCalled()
  })

  test('calls onUp when up arrow is pressed', async () => {
    const onUp = vi.fn()
    const { stdin } = render(
      <TestComponent onStop={vi.fn()} onCancel={vi.fn()} onUp={onUp} />,
    )

    await tick()
    stdin.write('[A')
    await tick()

    expect(onUp).toHaveBeenCalledTimes(1)
  })

  test('calls onDown when down arrow is pressed', async () => {
    const onDown = vi.fn()
    const { stdin } = render(
      <TestComponent onStop={vi.fn()} onCancel={vi.fn()} onDown={onDown} />,
    )

    await tick()
    stdin.write('[B')
    await tick()

    expect(onDown).toHaveBeenCalledTimes(1)
  })
})
