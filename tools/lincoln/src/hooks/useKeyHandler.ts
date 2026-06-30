import { useInput } from 'ink'

export interface KeyHandlerOptions {
  onStop: () => void
  onCancel: () => void
  onUp?: () => void
  onDown?: () => void
}

export function useKeyHandler({ onStop, onCancel, onUp, onDown }: KeyHandlerOptions) {
  useInput((input, key) => {
    if (key.return || input === '\r' || input === '\n') {
      onStop()
      return
    }

    if (input === 'q' || input === 'Q' || key.escape) {
      onCancel()
      return
    }

    if (key.upArrow) {
      onUp?.()
      return
    }

    if (key.downArrow) {
      onDown?.()
      return
    }

    if (key.ctrl && input === 'c') {
      onCancel()
    }
  })
}
