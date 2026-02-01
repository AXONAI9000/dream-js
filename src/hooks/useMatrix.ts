import { useContext } from 'react'
import { MatrixContext } from '../context/MatrixContext'
import type { MatrixContextValue } from '../types'

export function useMatrix(): MatrixContextValue {
  const context = useContext(MatrixContext)
  if (!context) {
    throw new Error('useMatrix must be used within a MatrixProvider')
  }
  return context
}
