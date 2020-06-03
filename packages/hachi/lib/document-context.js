import React from 'react'

export const DocumentContext = React.createContext(null)

if (process.env.NODE_ENV !== 'production') {
  DocumentContext.displayName = 'DocumentContext'
}
