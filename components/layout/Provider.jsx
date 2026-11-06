"use client"

import { useEffect } from 'react'
import { ThemeProvider, useTheme } from 'next-themes'
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  useColorScheme,
} from '@mui/material/styles'

const muiTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: { light: true, dark: true },
})

// Keeps MUI's mode in step with next-themes so they never disagree
function MuiModeSync() {
  const { theme } = useTheme()
  const { setMode } = useColorScheme()

  useEffect(() => {
    if (theme) setMode(theme) // 'light' | 'dark' | 'system'
  }, [theme, setMode])

  return null
}

export default function Provider({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MuiThemeProvider theme={muiTheme}>
        <MuiModeSync />
        {children}
      </MuiThemeProvider>
    </ThemeProvider>
  )
}