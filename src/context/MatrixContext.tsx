import { createContext } from 'react'
import type { MatrixContextValue } from '../types'

export const MatrixContext = createContext<MatrixContextValue | null>(null)
