'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface BlockUIState {
  isVisible: boolean
  message: string
  progress?: {
    current: number
    total: number
  }
}

interface BlockUIContextType {
  showBlockUI: (message: string) => void
  updateMessage: (message: string) => void
  updateProgress: (current: number, total: number) => void
  hideBlockUI: () => void
  state: BlockUIState
}

const BlockUIContext = createContext<BlockUIContextType | undefined>(undefined)

export function BlockUIProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BlockUIState>({
    isVisible: false,
    message: '',
  })

  const showBlockUI = useCallback((message: string) => {
    setState({
      isVisible: true,
      message,
    })
  }, [])

  const updateMessage = useCallback((message: string) => {
    setState((prev) => ({
      ...prev,
      message,
    }))
  }, [])

  const updateProgress = useCallback((current: number, total: number) => {
    setState((prev) => ({
      ...prev,
      progress: { current, total },
    }))
  }, [])

  const hideBlockUI = useCallback(() => {
    setState({
      isVisible: false,
      message: '',
      progress: undefined,
    })
  }, [])

  return (
    <BlockUIContext.Provider
      value={{ showBlockUI, updateMessage, updateProgress, hideBlockUI, state }}
    >
      {children}
    </BlockUIContext.Provider>
  )
}

export function useBlockUI() {
  const context = useContext(BlockUIContext)
  if (context === undefined) {
    throw new Error('useBlockUI must be used within a BlockUIProvider')
  }
  return context
}
