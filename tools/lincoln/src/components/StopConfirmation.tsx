import { Box, Text, useInput } from 'ink'
import React from 'react'

export interface StopConfirmationProps {
  sessionId: string
  workspaceRoot?: string
  onConfirm: () => void
  onCancel?: () => void
}

export function StopConfirmation({ sessionId, workspaceRoot, onConfirm, onCancel }: StopConfirmationProps) {
  const command = `claude process-interview ${sessionId}`

  useInput(() => {
    onConfirm()
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Stopped</Text>
      <Text>Session {sessionId} saved.</Text>
      {workspaceRoot ? <Text color="gray">Workspace: {workspaceRoot}</Text> : null}
      <Box paddingY={1} flexDirection="column">
        <Text>Run this command in your terminal to generate knowledge artifacts:</Text>
        <Text color="cyan">{command}</Text>
      </Box>
      {onCancel
        ? <Text color="gray">[any key] Copy command and exit · [n] Exit without copying</Text>
        : <Text color="gray">[any key] Exit</Text>}
    </Box>
  )
}
