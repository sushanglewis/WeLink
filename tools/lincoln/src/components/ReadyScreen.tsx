import { Box, Text } from 'ink'
import React from 'react'

export interface ReadyScreenProps {
  sessionId: string
  topic: string
  designId: string
  branch: string
  selectedIndex?: number
}

const OPTIONS = [
  { label: '开始录音', hint: 'Enter' },
  { label: '退出', hint: 'q / Esc' },
]

export function ReadyScreen({ sessionId, topic, designId, branch, selectedIndex = 0 }: ReadyScreenProps) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" padding={1}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box gap={1}>
          <Text color="red">●</Text>
          <Text color="yellow">●</Text>
          <Text color="green">●</Text>
        </Box>
        <Text bold color="white">Lincoln Recorder</Text>
      </Box>

      <Box flexDirection="column" paddingY={1}>
        <Text color="gray">Session: {sessionId}</Text>
        {topic ? <Text color="gray">Topic: {topic}</Text> : null}
        {designId ? <Text color="gray">Design: {designId}</Text> : null}
        {branch ? <Text color="gray">Branch: {branch}</Text> : null}
      </Box>

      <Box flexDirection="column" paddingY={1} gap={1}>
        {OPTIONS.map((option, index) => {
          const isSelected = index === selectedIndex
          return (
            <Box key={option.label} flexDirection="row" gap={1}>
              <Text color={isSelected ? 'green' : 'gray'}>{isSelected ? '▸' : ' '}</Text>
              <Text bold={isSelected} color={isSelected ? 'green' : 'gray'} dimColor={!isSelected}>
                {option.label}
              </Text>
              <Text color="gray" dimColor>
                [{option.hint}]
              </Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
